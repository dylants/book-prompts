variable "TAG" {
  default = "latest"
}

group "default" {
  targets = ["nextjs"]
}

target "nextjs" {
  args = {
    DOCKER_TAG = "${TAG}"
  }
  context = "."
  dockerfile = "Dockerfile"
  no-cache = true
  platforms = [
    # amd64 architecture for x86_64 architecture
    # "linux/amd64",
    "linux/arm64"
  ]
  tags = [
    "ghcr.io/dylants/book-prompts:${TAG}"
  ]
}
