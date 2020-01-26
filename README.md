# GRAM: A Generic REST-API Mock 

## Description

GRAM is a simple Java based application which serves _mock_ API end points flexibly defined using a **RESTful interface** or using an integrated **web app**.

The defined mock API end points can be accessed at the same server under the sub-path `/mock/`.

The server does not have backend persistence (yet), which means all configurations get lost upon server shutdown. However the server supports loading data from a JSON configuration file during start-up. The file can be specified using command line parameter `--data`, or simply be named "`data.json`" and put together with the server jar file.

## End Point Definition

Following aspects of an end point can be defined:

* **Path** for the request (e.g "foo/bar", then it will be accessible at `/mock/foo/bar`)
* **Request method** (`GET`, `POST` etc.)
* **Status code** of response (`200 OK`, `404 Not Found` etc.)
* **Content type** of response (e.g. application/json, text/html)
* **Response Body**
* **Delay** (psuedo delay before the response is delivered, in millisecond)

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


## Get started

1. Start server

       java -jar gram-0.0.1-SNAPSHOT.jar

2. Open browser and go to: http://localhost:9000/ , or interact directly with the REST-interface at http://localhost:9000/config

3. All defined end points can be accessed at http://localhost:9000/mock/*

### Command-Line Parameters

* `--server.port=<port>`

  Server by default starts with port *9000*. Use this parameter to change to other port.

* `--data=<JSON data file>`

  Server by default starts with no end point definition. If a file named `data.json` exists in the same directory the JAR file is executed, or any file specified using `--data`, server will attempt to parse the file content into end point definitions and load them. (File format must be JSON, the content should look similar to the response of GET-request to REST-API `/config?download`)

## Development

### Requirements

* Server
  * OpenJDK 8+
  * Maven
* Web-App
  * node/npm

### Dependencies

* Java
  - `spring-boot`
* JavaScript
  - `react-js`: view rendering
  - `redux-toolkit` / `react-redux` state management
  - `axios`: async communication to backend API
  - `material-ui`: UI component library

## Build

    mvn package

## Dev-Server

* Backend (available at http://localhost:9000)

      mvn spring-boot:run

* Frontend (available at http://localhost:3000)

      cd src/main/javascript
      npm install (first time)
      npm start