resource "aws_cognito_user_pool" "default" {
  name = var.cognito_name

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 6
  }

  schema {
    name                     = "foo"
    attribute_data_type      = "String"
    mutable                  = false
    required                 = true
    developer_only_attribute = false
    string_attribute_constraints {}
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Account Confirmation"
    email_message        = "Your confirmation code is {####}"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = var.tags
}



resource "aws_cognito_user_pool_client" "client" {
  name = "cognito-client"

  user_pool_id = aws_cognito_user_pool.default.id
  generate_secret = false
  refresh_token_validity = 90
  prevent_user_existence_errors = "ENABLED"
  callback_urls = ["https://d1o23vstj4q9h8.cloudfront.net"]
  
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain       = "ishwarkhadka"
  user_pool_id = "${aws_cognito_user_pool.default.id}"
}
