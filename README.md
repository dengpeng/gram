# GRAM: A Generic REST-API Mock 

## Description

GRAM is a simple Java based application which serves _mock_ API end points flexibly defined using a **RESTful interface** or using an integrated **web app**.

The defined mock API end points can be accessed at the same server under the sub-path `/mock/`. Some information of the requests made to each mock end point will be logged (remote IP, query parameters etc.) and can be looked up.

The server does not have backend persistence (yet), which means all configurations get lost upon server shutdown. However the server supports loading data from a JSON configuration file during start-up. The file can be specified using command line parameter `--data`, or simply be named "`data.json`" and put together with the server jar file.

## Get started

1. Start server

       java -jar gram-0.0.1-SNAPSHOT.jar

   or if use native image

       . /gram 

2. Open browser and go to: http://localhost:9000/ , or interact directly with the REST-interface at http://localhost:9000/config

3. All defined end points can be accessed at http://localhost:9000/mock/*

### Command-Line Parameters

* `--server.port=<port>`

  Server by default starts with port *9000*. Use this parameter to change to other port.

* `--data=<JSON data file>`

  Server by default starts with no end point definition. If a file named `data.json` exists in the same directory the JAR file is executed, or any file specified using `--data`, server will attempt to parse the file content into end point definitions and load them. (File format must be JSON, the content should look similar to the response of GET-request to REST-API `/config?download`)


## End Point Definition

Following aspects of an end point can be defined:

* **Path** for the request (e.g "foo/bar", then it will be accessible at `/mock/foo/bar`)
* **Request method** (`GET`, `POST` etc.)
* **Status code** of response (`200 OK`, `404 Not Found` etc.)
* **Content type** of response (e.g. application/json, text/html)
* **Response Body**
* **Delay** (psuedo delay before the response is delivered, in millisecond)

The defined response body can contain SpringEL expressions which will be parsed and evaluated in the web request context, where some attributes like `timeStamp`, `queryParams` and `remoteAddress` are accessible.

Moreover, an end point definition can be toggled active/inactive. Among multiple definitions with the same path/method combination, only one definition can be activated.

Currently following content types can be used:

* application/json
* application/xml
* text/html
* text/plain

## REST-API for configuring end points

### `/config`

* GET

  Retreive a list of exisiting end point definitions

  + Parameter
  
    - `download` (opitonal)
  
       if given, the output JSON will be pretty formatted and proper header will be set in response to trigger download in browser.

  + Response
    - `200 OK` and a list of existing end point definitions

* POST

  Create a new end point definition. It will be automatically activated if no other definition exists with the same path/method combination. Otherwise it will be created inactive. 
  
  Support parameters in request body (JSON object) as well as using query parameters.

  + Parameters
    - `path` (Required, non-empty)
    - `method` (standard HTTP request method, default: `GET`)
    - `status` (standard HTTP status enum, default: `OK`)
    - `contentType` (default: `application/json`)
    - `response`
    - `delay`

  + Response
    - `201 Created`, and the created end point definition. The URI of the created entity is available in the header "Location"

* PUT

  Updating an existing end point. If a definition is toggled active, active definition with the same path/method will be deactivated. Support parameters in request body as well as using query parameters
  
  + Parameters
    - `id`: required
    - all parameters for POST-request are supported. 

  + Response
    - `200 OK` and a list of changed end point definitions
    - `404 Not Found` if the end point with given id is not found

* DELETE

  Remove an existing end point. 
  
  + Parameter 
    - `id` (required)

  + Response: 
    - `200 OK` and the deleted end point definition
    - `404 Not Found` if the end point with given id is not found


### `/config/[id]`

* GET

  + Response
    - `200 OK` and the end point definition by the given id
    - `404 Not Found` if the definition with given id is not found

* PUT

  + Parameters
    - same as PUT-reqeust to `/config`, except parameter "id" is not required.
    
  + Response 
    - same as PUT-reqeust to `/config`, see above

* DELETE

  + Parameters
    - same as DELETE-reqeust to `/config`, except parameter "id" is not required.
    
  + Response
    - same as DELETE-reqeust to `/config`, see above

### `/config/httpStatus`

* GET
  + Response
    - `200 OK` and a list of available HTTP status

### `/config/httpMethod`
* GET
  + Response
    - `200 OK` and a list of available HTTP Methods

### `/config/contentType`
* GET
  + Response
    - `200 OK` and a list of available content types

### `/config/[id]/request`
* GET
  + Parameters
    - page: default value is 1
    - pageSize: default value is 5
  + Response
    - `200 OK` and an object with following entries
       - `data` - the request log data of the given page
       - `totalPages`
       - `currentPage`
       - `pageSize`
       - `totalRecords`
    - `404 Not Found` if no end point can be found with the given id

## Development

### Requirements

* Server
  * OpenJDK 8+
  * Maven
* Web-App
  * node/npm

### Dependencies

* Java
  - [spring-boot][6]:
* JavaScript
  - [react-js][1]: view rendering
  - [redux-toolkit / react-redux][2] state management
  - [axios][3]: async communication to backend API
  - [material-ui][4]: UI component library
  - [dateFormat][5]: for formatting date/time

## Build

### Build Java Jar pacakge

    mvn package

### Build GraalVM Native Image

    mvn -Pnative -DskipTests pacakge

## Dev-Server

* Backend (available at http://localhost:9000)

      mvn spring-boot:run

* Frontend (available at http://localhost:3000)

      cd src/main/javascript
      npm install (first time)
      npm start

[1]: https://reactjs.org
[2]: https://redux.js.org
[3]: https://github.com/axios/axios
[4]: https://material-ui.com
[5]: https://github.com/felixge/node-dateformat
[6]: https://spring.io/projects/spring-boot