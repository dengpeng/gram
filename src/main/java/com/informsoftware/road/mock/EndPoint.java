package com.informsoftware.road.mock;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * EndPoint
 */
public class EndPoint {

  static final Logger log = LoggerFactory.getLogger(EndPoint.class);

  private String id;
  private boolean active;

  private String uri;
  private String response;
  private HttpStatus status;
  private RequestMethod method;
  private MediaType mediaType;

  public EndPoint () {
    this.id = UUID.randomUUID().toString();
  }

  public EndPoint (String uri, String response, HttpStatus status) {
    this ();
    this.uri = uri;
    this.response = response;

    if (status != null) {
      this.status = status;
    }
  }

  public EndPoint (String uri, String response, HttpStatus status, MediaType mediaType) {
    this (uri, response, status);

    if (mediaType != null) {
      this.mediaType = mediaType;
    }
  }

  public EndPoint (String uri, String response, HttpStatus status, RequestMethod method) {
    this (uri, response, status);

    if (method != null) {
      this.method = method;
    }
  }

  public EndPoint (String uri, String response, HttpStatus status, RequestMethod method,  MediaType mediaType) {
    this (uri, response, status, method);

    if (method != null) {
      this.method = method;
    }
  }  

  public String getUri() {
    return uri;
  }

  public void setUri(String uri) {
    if (!StringUtils.isEmpty(uri)) {
      this.uri = uri;
    }
  }

  public String getResponse() {
    return response;
  }

  public void setResponse(String response) {
    if (response != null) {
      this.response = response;
    }
  }

  public HttpStatus getStatus() {
    return status;
  }

  public void setStatus(HttpStatus status) {
    if (status != null) {
      this.status = status;
    }
  }

  public String getContentType () {
    return mediaType == null ? "" : mediaType.toString();
  }

  public void setContentType (String contentType) {
    MediaType mediaType = null;
    
    try {
      mediaType = MediaType.parseMediaType(contentType);
    } catch (IllegalArgumentException e) {
      log.error("Cannot parse content type", e);
    }

    if (mediaType != null) {
      setMediaType(mediaType);
    }
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  @JsonIgnore
  public MediaType getMediaType () {
    return mediaType;
  }

  public void setMediaType (MediaType mediaType) {
    if (mediaType != null) {
      this.mediaType = mediaType;
    }
  }

  public RequestMethod getMethod () {
    return method;
  }

  public void setMethod (RequestMethod method) {
    if (method != null) {
      this.method = method;
    }
  }

}