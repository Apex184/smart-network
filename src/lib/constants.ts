export enum ResponseMessage {
  Welcome = 'Welcome onboard!',
  Success = "Created successfully",
  VerificationEmailSent = "Verification email sent, please check your mailbox",
  EmailVerified = "Your email has been verified",
  OtpEmailSent = 'An OTP has been sent to your email inbox',
  AdminSignupSuccess = "AdminSignupSuccess"
}


export enum ErrorMessage {
  InvalidRequestParameters = 'Invalid request parameters',
  InvalidToken = 'Invalid code',
  TokenExpired = 'Code expired',
  VerificationCodeExpired = 'Verification Code expired',
  EmailNotVerified = 'Please verify your email first',
  UserAlreadyExists = 'Email already in use',
  InvalidCredentials = 'Invalid credentials',
  Required = 'Please provide the required fields',
  Unauthenticated = 'Sorry, you are not signed in',
  Exists = 'Already exists',
  NotFound = 'Not found',
  ServerError = 'Something went wrong. It would be nice if you report this to us',
  Unauthorized = 'Sorry, you do not have permission to perform this action',
  InternalServerError = "InternalServerError"
}
