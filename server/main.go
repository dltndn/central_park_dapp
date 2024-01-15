package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.POST("/welcome", func(c *gin.Context) {
		name := c.PostForm("name")
		message := "Welcome, " + name + "!"
		c.JSON(http.StatusOK, gin.H{
			"message": message,
		})
	})

	r.GET("/greet", func(c *gin.Context) {
		name := c.Query("name") // 클라이언트로부터 'name' 쿼리 문자열을 받습니다.
		message := "Hello, " + name + "!"
		c.JSON(http.StatusOK, gin.H{
			"message": message,
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	// test := controllers.GetOwnSpot("")
	// fmt.Println("test:", test)
}
