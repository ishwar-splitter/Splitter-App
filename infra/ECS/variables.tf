variable "cluster_name" {
  description = "The name of the ECS cluster"
}

variable "task_family" {
  description = "The family of the ECS task definition"
}

variable "cpu" {
  description = "The number of CPU units to reserve for the task"
}

variable "memory" {
  description = "The amount of memory (in MiB) to reserve for the task"
}

variable "container_name" {
  description = "The name of the container"
}

variable "ecr_repository_url" {
  description = "The URL of the ECR repository"
}

variable "image_tag" {
  description = "The tag of the image to use from ECR"
}

variable "container_port" {
  description = "The port on which the container listens"
}

variable "service_name" {
  description = "The name of the ECS service"
}

variable "desired_count" {
  description = "The desired number of task instances"
}

variable "subnets" {
  description = "The subnets for the ECS service"
  type        = list(string)
}

variable "security_groups" {
  description = "The security groups for the ECS service"
  type        = list(string)
}

variable "target_group_arn" {
  description = "The ARN of the target group for the load balancer"
}

variable "tags" {
  type = map(any)

}