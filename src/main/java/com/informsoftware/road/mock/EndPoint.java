package com.informsoftware.road.mock;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.informsoftware.road.mock.JsonViews.Internal;
import com.informsoftware.road.mock.JsonViews.Public;

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

  static final Logger           log = LoggerFactory.getLogger (EndPoint.class);

  @JsonView (Public.class)
  private String                id;
  @JsonView (Public.class)
  private boolean               active;

  @JsonView (Public.class)
  private String                path;
  @JsonView (Public.class)
  private String                response;
  @JsonView (Public.class)
  private HttpStatus            status;
  @JsonView (Public.class)
  private RequestMethod         method;
  @JsonView (Public.class)
  private Long                  delay;                                         // millisecond

  @JsonView (Internal.class)
  private List<EndPointRequest> loggedRequests;

  private MediaType             mediaType;

  public EndPoint () {
    loggedRequests = Collections.synchronizedList (new ArrayList<> ());
  }

  public EndPoint (String path,
                   String response,
                   HttpStatus status) {
    this ();
    setPath (path);
    this.response = response;

    if (status != null) {
      this.status = status;
    }
  }

  public EndPoint (String path,
                   String response,
                   HttpStatus status,
                   MediaType mediaType) {
    this (path, response, status);

    if (mediaType != null) {
      this.mediaType = mediaType;
    }
  }

  public EndPoint (String path,
                   String response,
                   HttpStatus status,
                   RequestMethod method) {
    this (path, response, status);

    if (method != null) {
      this.method = method;
    }
  }

  public EndPoint (String path,
                   String response,
                   HttpStatus status,
                   RequestMethod method,
                   MediaType mediaType) {
    this (path, response, status, method);

    if (mediaType != null) {
      this.mediaType = mediaType;
    }
  }

  public EndPoint (String path,
                   String response,
                   HttpStatus status,
                   RequestMethod method,
                   MediaType mediaType,
                   Long delay) {
    this (path, response, status, method, mediaType);

    if (delay != null) {
      this.delay = delay;
    } else {
      delay = 0L;
    }
  }

  public String getPath () {
    return path;
  }

  public void setPath (String path) {
    if (StringUtils.hasText (path)) {
      if (path.startsWith ("/")) {
        path = path.substring (1);
      }
      this.path = path;
    }
  }

  public String getResponse () {
    return response;
  }

  public void setResponse (String response) {
    if (response != null) {
      this.response = response;
    }
  }

  public HttpStatus getStatus () {
    return status;
  }

  public void setStatus (HttpStatus status) {
    if (status != null) {
      this.status = status;
    }
  }

  @JsonView (Public.class)
  public String getContentType () {
    return mediaType == null ? "" : mediaType.toString ();
  }

  public void setContentType (String contentType) {
    MediaType parsedMediaType = null;

    try {
      parsedMediaType = MediaType.parseMediaType (contentType);
    } catch (IllegalArgumentException e) {
      log.error ("Cannot parse content type", e);
    }

    if (parsedMediaType != null) {
      setMediaType (parsedMediaType);
    }
  }

  public String getId () {
    if (id == null) {
      id = UUID.randomUUID ().toString ();
    }
    return id;
  }

  public void setId (String id) {
    this.id = id;
  }

  public boolean isActive () {
    return active;
  }

  public void setActive (boolean active) {
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

  public Long getDelay () {
    return delay;
  }

  public void setDelay (Long delay) {
    if (delay >= 0) {
      this.delay = delay;
    }
  }

  public List<EndPointRequest> getLoggedRequests () {
    return loggedRequests;
  }

  public void setLoggedRequests (List<EndPointRequest> loggedRequests) {
    this.loggedRequests = loggedRequests;
  }

  public EndPointRequestData getLoggedRequests (int pageSize,
                                                int page) {
    int begin = (page - 1) * pageSize;
    int end = page * pageSize;
    int totalRecords = loggedRequests.size ();
    int totalPages = (int) Math.ceil (totalRecords / Double.valueOf (pageSize));
    List<EndPointRequest> data = new ArrayList<> ();

    if (begin >= 0 && begin < totalRecords) {
      if (end > totalRecords) {
        end = totalRecords;
      }
      data.addAll (loggedRequests.subList (begin, end));
    }

    return new EndPointRequestData (data, totalRecords, totalPages, page, pageSize);
  }

  public EndPointRequest logRequest (HttpServletRequest servletRequest) {
    EndPointRequest loggedRequest = new EndPointRequest (servletRequest);
    loggedRequests.add (0, loggedRequest);
    return loggedRequest;
  }
}
