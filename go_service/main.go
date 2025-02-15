package main

import (
	"context"
	"log"
	"net"

	db "go_service/db"

	pb "go_service/proto"

	empty "github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedRandomNumbersServiceServer
	data map[int32][]int32
}

func (s *server) SendRandomNumbers(ctx context.Context, req *pb.RandomNumbersRequest) (*empty.Empty, error) {
	db.InitializeDatabase()
	if err := db.SaveRandomNumbers(req.MaxNumber, req.RandomNumbers); err != nil {
		return nil, err
	}
	return &empty.Empty{}, nil
}
func (s *server) GetAverage(ctx context.Context, req *pb.AverageRequest) (*pb.AverageResponse, error) {
	db.InitializeDatabase()

	strTime := req.StartDate.AsTime()
	endTm := req.EndDate.AsTime()

	averages, err := db.GetAverages(strTime, endTm, int(req.Limit), int(req.Offset))
	if err != nil {
		return nil, err
	}

	averageResponse := &pb.AverageResponse{}
	for avg, randomNums := range averages {
		averageResponse.Averages = append(averageResponse.Averages, &pb.Average{
			MaxNumber: avg,
			Value:     randomNums,
		})
	}
	return averageResponse, nil
}

func main() {

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterRandomNumbersServiceServer(s, &server{data: make(map[int32][]int32)})
	log.Println("Server is running on port :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
