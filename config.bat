Rem Setting HOSTNAME & PORT from Command Line
set API1_STATUS=%1
set API1_PORT_NUMBER=%2

set API2_STATUS=%3
set API2_PORT_NUMBER=%4

set API3_STATUS=%5
set API3_PORT_NUMBER=%6

Rem Account API
cd "AccountAPI\"
if %API1_STATUS%==true (start npm run dev)
cd ..

Rem Product API
cd "ProductAPI\"
if %API2_STATUS%==true (start npm run dev)
cd ..

Rem Order API
cd "OrderAPI\"
if %API3_STATUS%==true (start npm run dev)
cd ..
