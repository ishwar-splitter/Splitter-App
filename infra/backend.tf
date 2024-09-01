terraform {
  backend "s3" {
    bucket = "ishwar-splitter-infra-state-bucket"
    key = "terrform/state"
    region = "us-east-1"
    dynamodb_table = "ishwar-splitter-terraform-lock-table"
  }
}