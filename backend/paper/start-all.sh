#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if port is in use
check_port() {
    lsof -i:$1 > /dev/null
    return $?
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

echo -e "${BLUE}Starting Media Mosaic Development Environment...${NC}"

# Check Docker status
check_docker

# Kill existing processes on ports if they exist
for port in 3000 3001 3002 3003 4001 4002 4003 9090 3005; do
    if check_port $port; then
        echo -e "${RED}Killing process on port $port${NC}"
        kill $(lsof -t -i:$port) 2>/dev/null
    fi
done

# Start monitoring stack
echo -e "${BLUE}Starting Prometheus and Grafana...${NC}"
docker-compose -f docker-compose.monitoring.yml down
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for monitoring stack to be ready
sleep 5

# Start microservices
echo -e "${GREEN}Starting User Service (TCP: 3001, HTTP: 4001)...${NC}"
npm run start:dev user &

echo -e "${GREEN}Starting News Service (TCP: 3002, HTTP: 4002)...${NC}"
npm run start:dev news &

echo -e "${GREEN}Starting Sports Service (TCP: 3003, HTTP: 4003)...${NC}"
npm run start:dev sports &

echo -e "${GREEN}Starting Gateway Service (HTTP: 3000)...${NC}"
npm run start:dev paper &

# Function to check if service is healthy
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    while ! curl -s "http://localhost:$port/health" > /dev/null; do
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}$service failed to start${NC}"
            return 1
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    echo -e "${GREEN}$service is healthy${NC}"
}

# Wait for services to be healthy
echo "Waiting for services to be ready..."
check_service "Gateway" 3000
check_service "User Service" 4001
check_service "News Service" 4002
check_service "Sports Service" 4003

echo -e "${BLUE}All services are running:${NC}"
echo -e "${GREEN}Gateway:${NC} http://localhost:3000"
echo -e "${GREEN}User Service:${NC} TCP://localhost:3001 (Metrics: http://localhost:4001)"
echo -e "${GREEN}News Service:${NC} TCP://localhost:3002 (Metrics: http://localhost:4002)"
echo -e "${GREEN}Sports Service:${NC} TCP://localhost:3003 (Metrics: http://localhost:4003)"
echo -e "${GREEN}Prometheus:${NC} http://localhost:9090"
echo -e "${GREEN}Grafana:${NC} http://localhost:3005 (admin/admin)"

# Trap Ctrl+C and clean up
trap 'echo -e "${RED}Stopping all services...${NC}"; docker-compose -f docker-compose.monitoring.yml down; pkill -f "npm run start:dev"; exit 0' SIGINT

# Keep script running
wait