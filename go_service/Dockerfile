FROM golang:1.23.2 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

RUN apt-get update &&\
    apt-get install -y protobuf-compiler &&\
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest &&\
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest &&\
    rm -rf /var/lib/apt/lists/*


COPY . .

RUN wget https://raw.githubusercontent.com/elValeron/contracts/refs/heads/main/random_numbers/random_numbers.proto

RUN protoc --proto_path=. --go-grpc_opt=Mrandom_numbers.proto=./proto --go_opt=Mrandom_numbers.proto=./proto --go_out=. --go-grpc_out=. random_numbers.proto

RUN CGO_ENABLED=0 GOOS=linux go build -o server main.go

FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY --from=builder /app .

CMD ["./server"]
