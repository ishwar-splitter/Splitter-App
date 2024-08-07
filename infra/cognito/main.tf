resource "aws_cognito_user_pool" "default" {
 name =var.cognito_name 
 tags = var.tags
}
