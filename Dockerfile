FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create a script to run the app in a loop
RUN echo '#!/bin/bash\nwhile true; do\n  node dist/mudah-monitor.js\n  sleep 3600\ndone' > run.sh
RUN chmod +x run.sh

CMD ["./run.sh"]