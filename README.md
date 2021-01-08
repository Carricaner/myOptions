# MyOptions
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/myOptions.png" alt="drawing" style="width:20%;margin:5px 0px 30px 40px;" align="right">

> MyOptions is a mock options trade website which consists of real-time index display, real-time trade system, historical data analysis as well as user personal dashboard for the purpose of letting beginners know options easily.

### What is options?
To know options, Myoptions lay breif and easy introduction on the homepage. [Link](https://myoptions.site/index.html)


## Test Account
You can log in with the test account below and use the service in MyOptions:

**Email:** myoptions@myoptions.com

**Password:** myoptions20201231

## Table of Content
* [Features](#Features)
* [Technologies](#Technologies)
* [Contact](#Contact)

## Features
* Introduction:
  - Fundamental options introduction
  - demonstration on the realtionship between profit and index of TPE: TAIEX.

<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/WqXRF9VQCZ.gif" alt="drawing" style="width:80%;margin:5px 0px 30px 40px;"/>

* Mock Trade System:
  - The real-time index of TXF and TX are ploted.
  - The real-time options price is shown (flickered when refreshed.)
  - User parts, total money, and total profit are shown at the buttom of the page.
  - User can buy the desired product and the region of user parts and money will be refreshed immediately.

<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/mrRYAajIyh.gif" alt="drawing" style="width:80%;margin:5px 0px 20px 40px;"/>
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/nLxKFsOvN0.gif" alt="drawing" style="width:80%;margin:0px 0px 30px 40px;"/>

* Historical Data Analysis
  - Candlestick plot of TXF in recent 90 days
  - Options price distribution of former day
  - The number of foriegn investors' parts and cost

<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/d7EZj4VyO4.gif" alt="drawing" style="width:80%;margin:5px 0px 30px 40px;"/>

* User Individual Dashboard
  - Collection of statistic performance data and plots

<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/eFFyw5QiEj.gif" alt="drawing" style="width:80%;margin:5px 0px 30px 40px;"/>

## Technologies
### Architecture

### Backend
* Environment: **Linux**
* Server: **Node.js** + **Express.js**
* Framework: **Express.js**
* Data Crawling: **Python** + **Selenium** + **BeautifulSoup**
* Job Scheduler: **crontab** + **PM2**
* Real-time Data Transport: **Socket.io**
* User Authorization: **JWT**

**Crontab:** 
Available Memory Maintenance & Historical Data Crawling
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/cmd_E3u6Pg1RCX.jpg" alt="drawing" style="width:80%;margin:5px 0px 20px 40px;"/>
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/4HGydRUAHu.gif" alt="drawing" style="width:80%;margin:0px 0px 30px 40px;"/>
**PM2:**
Server + Real-time Data Crawling
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/cmd_QMjVKlHPzh.jpg" alt="drawing" style="width:80%;margin:5px 0px 30px 40px;"/>

### Front-End 
* **HTML** + **CSS** + **JavaScript**
* Toolkit: **Bootstrap**
* 2D Visualization: **Highcharts**


### Database
* in-memory data structure store: **Redis**
* RDBMS: **AWS RDS** + **MySQL**
* MySQL Database Design: 
<img src="https://darrenstylish.s3-ap-northeast-1.amazonaws.com/myOptions/ER_diagram.png" alt="drawing" style="width:80%;margin:5px 0px 30px 40px;"/>

### Networking
* Protocol: **HTTP & HTTPs**
* Proxy server: **Nginx**


### Tools
* Linter: **ESLint**
* Test: **Mocha** + **Chai**
* Version Control: **Git**


### Others
* Design Pattern: **MVC**


### AWS Cloud Services
* **EC2** + **S3** + **CloudFront**


## Contact
Email: occa8520@gmail.com