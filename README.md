# Campus Help frontend

## 先决条件

在开始之前，请确保你已经在本地安装了以下工具：

- Docker
- Git

## 克隆项目仓库

首先，克隆项目仓库：

```sh
git clone https://github.com/你的用户名/你的项目名.git
cd 你的项目名
```

## 构建Docker镜像

使用以下命令来构建Docker镜像：

```sh
docker build -t campus_help_frontend:latest .
```

## 运行Docker容器

使用以下命令来运行Docker容器：

```sh
docker run -d -p 80:80 --name campus_help_fronetnd campus_help_frontend:latest
```

这会将容器中的80端口映射到主机的80端口。

## 停止和删除容器

要停止运行中的容器，请使用：

```sh
docker stop campus_help_frontend
```

要删除停止的容器，请使用：

```sh
docker rm campus_help_frontend
```

## 访问应用

在浏览器中访问`http://localhost`。

## 自定义配置

可以根据需要修改`nginx.conf`文件，以自定义Nginx的配置。
以上步骤，你可以使用Docker轻松地部署你的Vue.js应用。
