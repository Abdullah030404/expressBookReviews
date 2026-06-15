# coding-project-template

2.  curl.exe http://localhost:5000/
3.  curl.exe http://localhost:5000/isbn/1
4.  curl.exe "http://localhost:5000/author/Unknown"   
5.  curl.exe "http://localhost:5000/title/Things-Fall-Apart"
6.  curl.exe http://localhost:5000/review/2
7.  curl.exe -X POST -H "Content-Type: application/json" -d '{\"username\":\"john_doe\", \"password\":\"secret123\"}' http://localhost:5000/register
8.  curl.exe -c cookie.txt -X POST -H "Content-Type: application/json" -d '{\"username\":\"john_doe\", \"password\":\"secret123\"}' http://localhost:5000/customer/login
9.  curl.exe -b cookie.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=Great%20book!"
10. curl.exe -b cookie.txt -X DELETE http://localhost:5000/customer/auth/review/1
11. 