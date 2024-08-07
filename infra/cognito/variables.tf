variable "cognito_name" {
  type        = string
  description = "Name of the cognito pool being created"
}

variable "tags" {
  type = map(any)
}