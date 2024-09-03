// ecs/main.tf
resource "aws_ecs_cluster" "this" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "disabled"
  }


  tags = var.tags
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.this.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# resource "aws_ecs_task_definition" "splitter_api_task_def" {
#   family                   = var.task_family
#   network_mode             = "awsvpc"
#   requires_compatibilities = ["FARGATE"]
#   cpu                      = var.cpu
#   memory                   = var.memory
#   execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
#   task_role_arn = aws_iam_role.ecs_task_role.arn
#   container_definitions = jsonencode([
#     {
#       name      = var.container_name
#       image     = "${var.ecr_repository_url}:${var.image_tag}" 
#       essential = true
#       portMappings = [
#         {
#           containerPort = var.container_port
#           hostPort      = var.container_port
#           protocol      = "tcp"
#         }
#       ]
      
#       environment = [
#         # {
#         #   name  = "DATABASE_URL"
#         #   value = var.database_url
#         # },
#         # {
#         #   name  = "OTHER_ENV_VAR"
#         #   value = var.other_env_var
#         # }
#       ]
#     }

#   ])
#   tags = var.tags
# }
resource "aws_ecs_task_definition" "splitter_api_task_def" {
  family                   = var.task_family
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }
  container_definitions = jsonencode([
    {
      name        = "${var.container_name}"
      image       = "${var.ecr_repository_url}:${var.image_tag}"
      cpu         = 1024
      memory      = 2048
      essential   = true

      
      portMappings = [
        {
          containerPort = "${var.container_port}"
          hostPort      = "${var.container_port}"
          protocol      = "tcp"
        }
      ]
      
       
      
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/ishwar-splitter-api-taskdef"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = var.tags
}


resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.splitter_api_task_def.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 90

  network_configuration {
    subnets          = var.subnets
    security_groups  = var.security_groups
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = var.container_port
  }

  tags = var.tags

}

resource "aws_iam_policy" "ecs_task_execution_role_policy" {
 name = "ishwar-splitter-task-execution-role-policy"
 policy = jsonencode({
  
    "Version": "2012-10-17",
    "Id": "__default_policy_ID",
    "Statement": [
        {
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:ecr:us-east-1:949263681218:repository/splitter-api",
            "Sid": "AllowECR"
        },
        {
            "Action": "ecr:GetAuthorizationToken",
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowECRAuthorization"
        },
        {
            "Action": [
                "logs:PutLogEvents",
                "logs:CreateLogStream"
            ],
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowCloudwatch"
        },
        {
            "Action": "ecs:*",
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowECS"
        },
        {
            "Action": "ecs:CreateTaskSet",
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowECSCreateTaskSet"
        },
        {
            "Action": [
                "cognito-idp:*",
                "cognito-identity:*"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:cognito-idp:us-east-1:949263681218:userpool/us-east-1_b2Dw85URC",
            "Sid": "Cognito"
        }
    ]

 })
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ishwar-splitter-ecs-task-execution-role"
  description           = "Allows ECS tasks to call AWS services on your behalf."
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  policy_arn = aws_iam_policy.ecs_task_execution_role_policy.arn
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_iam_policy" "ecs_task_role_policy" {
  name = "ishwar-splitter-ecs-task-role"
  policy = jsonencode({
    
    "Version": "2012-10-17"
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "secretsmanager:ListSecretVersionIds",
                "ecr:BatchCheckLayerAvailability"
            ],
            "Resource": [
                "arn:aws:secretsmanager:us-east-1:949263681218:secret:ishwar-splitter-secret-qu7Umw",
                "arn:aws:ecr:us-east-1:949263681218:repository/splitter-api"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "secretsmanager:ListSecrets"
            ],
            "Resource": "*"
        },
        {
            "Action": [
                "logs:PutLogEvents",
                "logs:CreateLogStream"
            ],
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowCloudwatch"
        },
        {
            "Action": "ecs:*",
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowECS"
        },
        {
            "Action": "ecs:CreateTaskSet",
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "AllowECSCreateTaskSet"
        },
        {
            "Action": [
                "cognito-idp:*",
                "cognito-identity:*"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:cognito-idp:us-east-1:949263681218:userpool/us-east-1_b2Dw85URC",
            "Sid": "Cognito"
        },
        {
            "Effect": "Allow",
            "Action": "rds-db:connect",
            "Resource": [
                "arn:aws:rds:us-east-1:949263681218:db:ishwar-splitter-db"
            ]
        }
    ]

  })
}

resource "aws_iam_role" "ecs_task_role" {
  name  = "ishwar-splitter-ecs-task-role"
  description           = "Allows ECS tasks to call AWS services on your behalf."
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_role_policy" {
  policy_arn = aws_iam_policy.ecs_task_role_policy.arn
  role       = aws_iam_role.ecs_task_role.name
}