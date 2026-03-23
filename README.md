## Error Handling Flow

The application implements a centralized exception handling mechanism that ensures consistent error responses across all API endpoints.

### Architecture Flow

```
┌──────────────────────┐
│    Service Layer     │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ throw new OperationNotPermittedException│
│         ("message")                     │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│GlobalExceptionHandler│
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ @ExceptionHandler                       │
│ (OperationNotPermittedException.class)  │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│      Build ExceptionResponse            │
│  • businessErrorCode (optional)         │
│  • businessErrorDescription (optional)  │
│  • error message                        │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  ResponseEntity with HTTP 400           │
│      (Bad Request)                      │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  Angular Frontend    │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Extract error.error.error or            │
│ error.error.businessErrorDescription    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│   Display to user    │
└──────────────────────┘
```

### Key Components

#### Backend
- **`OperationNotPermittedException`**: Custom exception thrown from service layer when an operation is not allowed
- **`GlobalExceptionHandler`**: Centralized exception handler that intercepts all exceptions
- **`ExceptionResponse`**: Standardized error response object containing:
  - `businessErrorCode`: Application-specific error code (optional)
  - `businessErrorDescription`: Human-readable error description (optional)
  - `message`: Error message

#### Frontend
- **Error Interceptor**: Captures HTTP error responses
- **Error Extraction**: Navigates the response structure to retrieve error details
- **User Display**: Presents user-friendly error messages

### HTTP Status Codes
- **400 Bad Request**: Used for business logic violations and operation not permitted scenarios

### Example Usage

```java
// Service layer
if (!hasPermission) {
    throw new OperationNotPermittedException("User does not have permission to perform this action");
}
```

```typescript
// Angular error handling
this.service.performAction().subscribe({
  error: (error) => {
    const message = error.error?.businessErrorDescription || 
                    error.error?.error || 
                    'An error occurred';
    this.notificationService.showError(message);
  }
});
```

### Benefits
- **Consistency**: Uniform error response structure across all endpoints
- **Centralized Handling**: Single point of error management
- **Type Safety**: Strongly typed error objects for frontend consumption
- **Maintainability**: Easy to add new exception types and modify error handling logic

```
Scenario	                                 Exception	         HTTP Status
Book archived/not shareable	OperationNotPermittedException	400
Own book borrow/return	OperationNotPermittedException	400
Already borrowed	           OperationNotPermittedException	400
Didn't borrow book	           OperationNotPermittedException	400
Not book owner (approve/update)	OperationNotPermittedException	400
```
