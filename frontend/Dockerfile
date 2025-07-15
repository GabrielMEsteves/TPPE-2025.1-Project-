FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor a porta do Vite
EXPOSE 5173

# Comando para rodar o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 