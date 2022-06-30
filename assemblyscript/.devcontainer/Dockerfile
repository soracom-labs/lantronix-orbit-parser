FROM node:14-buster

RUN apt-get update && apt-get install -y \
	wabt \
	bash-completion \
	&& rm -fr /var/lib/apt/lists

RUN export SORACOM_CLI_VERSION=$(curl -s https://api.github.com/repos/soracom/soracom-cli/tags | grep -Eo "v[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}" | head -n1 | tr -d v) \
	&& curl -L -o - https://github.com/soracom/soracom-cli/releases/download/v${SORACOM_CLI_VERSION}/soracom_${SORACOM_CLI_VERSION}_linux_amd64.tar.gz | tar zxf - \
	&& mv ./soracom_${SORACOM_CLI_VERSION}_linux_amd64/soracom /usr/local/bin/ \
	&& rmdir ./soracom_${SORACOM_CLI_VERSION}_linux_amd64

COPY ./soracom-orbit-tools-vscode.vsix /root
