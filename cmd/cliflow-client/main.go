package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

const (
	socketName     = "cliflow.sock"
	connectTimeout = 2 * time.Second
	readTimeout    = 3 * time.Second
)

func getSocketPath() string {
	// Check CLIFLOW_SOCKET env var first
	if p := os.Getenv("CLIFLOW_SOCKET"); p != "" {
		return p
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return filepath.Join("/tmp", socketName)
	}
	return filepath.Join(home, ".cliflow", socketName)
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "usage: cliflow-client '<json-request>'\n")
		os.Exit(1)
	}

	request := os.Args[1]
	socketPath := getSocketPath()

	// Connect to Unix socket with timeout
	conn, err := net.DialTimeout("unix", socketPath, connectTimeout)
	if err != nil {
		fmt.Fprintf(os.Stderr, "cliflow-client: connect error: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close()

	// Send the request (newline-delimited)
	_, err = fmt.Fprintf(conn, "%s\n", request)
	if err != nil {
		fmt.Fprintf(os.Stderr, "cliflow-client: write error: %v\n", err)
		os.Exit(1)
	}

	// Set read deadline
	conn.SetReadDeadline(time.Now().Add(readTimeout))

	// Read response (newline-delimited)
	reader := bufio.NewReader(conn)
	line, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintf(os.Stderr, "cliflow-client: read error: %v\n", err)
		os.Exit(1)
	}

	// Print response to stdout (the shell integration reads this)
	fmt.Print(line)

	// Parse response format
	if strings.HasPrefix(line, "OK\t") {
		// TSV format: "OK\t<count>\n" followed by <count> lines
		parts := strings.Split(line, "\t")
		if len(parts) >= 2 {
			countStr := strings.TrimSpace(parts[1])
			if count, err := strconv.Atoi(countStr); err == nil {
				for i := 0; i < count; i++ {
					line, err := reader.ReadString('\n')
					if err != nil {
						if err != io.EOF {
							fmt.Fprintf(os.Stderr, "cliflow-client: read error (line %d): %v\n", i+1, err)
						}
						break
					}
					fmt.Print(line)
				}
			}
		}
	} else if strings.HasPrefix(line, "ERR\t") {
		// TSV error format: "ERR\t<message>\n" - already printed first line, nothing more needed
	} else if strings.TrimSpace(line) == "" {
		// Empty line - ignore
	} else {
		// JSON format or unknown - potentially multi-line JSON?
		// Current server implementation sends single-line JSON.
		// If needed, we could read until EOF or look for balanced braces.
	}
}
