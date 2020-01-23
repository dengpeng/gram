# Generic Mock API Server

## Description

This is a simple web server which enables defining of flexible API end points using a RESTful interface at `/config` or using an integrated web app (WIP).

The defined API end points will be accessible at the same server under the sub-path `/mock/`.

The server does not have backend persistence (yet), which means all configurations get lost upon server shutdown. However the server supports loading data from a configuration file (in JSON format) during start-up. The file can be specified using command line parameter `--data`, or simply be named "`config.json`" and put together with the server jar file.

## End Point Definition

Following aspects of an end point can be defined:

* **Path** for the request (e.g "foo/bar", then it will be accessible at `/mock/foo/bar`)
* **Request method** (`GET`, `POST` etc.)
* **Status code** of response (`200`, `404` etc.)
* **Content type** of response (e.g. application/json, text/html)
* **Response Body**
* **Delay** (psuedo delay before the response is delivered, in millisecond)
* **Activeness** (An end point definition can be toggled active/inactive. For multiple definitions for the same path/method combination, only one can be active)

## REST-API for configuring end points

### `/config`

* GET

  Retreive a list of exisiting end point definitions

* POST

  Creating a new end point. Following parameters are supported>
  - `path` (Required)
  - `method` (standard HTTP request method, default: `GET`)
  - `status` (standard HTTP status code, default: `200`)
  - `contentType` (default: `application/json`)
  - `response`
  - `delay`
  - `active` (Will be true by default if no other definition exists for the same path and method)

* PUT

  Updating an existing end point. Parameter `id` is required, all parameters from POST-request are supported. If a definition is toggled active, any other active definition with the same path/method will be deactivated.

* DELETE

  Remove an existing end point. Parameter `id` is required.

### `/config/[id]`

* GET

  Retreive the definition for the end point by the given id

* PUT (Not implemented yet)

  Update definition of the end point by the given id

* DELETE (Not implemented yet)

  Remove the end point by the given id.

## Get started

1. Start server

       java -jar api-mock-0.0.1-SNAPSHOT.jar

2. Open browser and go to: http://localhost:9000/ or interact directly with the REST-interface at http://localhost:9000/config

3. All defined end points can be accessed at http://localhost:9000/mock/*

### Command-Line Parameters

* `--server.port=8000`

  Server by default starts with port *9000*. Use this parameter to change to other port.

* `--data=data.json`

  Server by default starts with no end point definition. If a file named `config.json` exists in the same directory the JAR file is executed, or is specified using `--data`. Server will attempt to parse the file content into end point definitions and load them. (File format must be JSON, the content should look similar to the response of GET-request to REST-API `/config`)
