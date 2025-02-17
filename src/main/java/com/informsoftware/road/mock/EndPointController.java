package com.informsoftware.road.mock;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.informsoftware.road.mock.JsonViews.Internal;
import com.informsoftware.road.mock.JsonViews.Public;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * DemoController
 */
@RestController
@RequestMapping ("/config")
public class EndPointController {

  EndPointService endPointService;
  ObjectMapper    objectMapper;

  @Autowired
  public void setEndPointService (EndPointService endPointService,
                                  ObjectMapper objectMapper) {
    this.endPointService = endPointService;
    this.objectMapper = objectMapper;
  }

  @GetMapping ("/httpMethod")
  public HttpMethod[] getHttpMethod () {
    return HttpMethod.values ();
  }

  @GetMapping ("/httpStatus")
  public List<Map<String, Object>> getHttpStatus () {
    List<Map<String, Object>> result = new ArrayList<> ();

    for (HttpStatus status: HttpStatus.values ()) {
      Map<String, Object> attrs = new HashMap<> ();
      attrs.put ("key", status.name ());
      attrs.put ("text", status.getReasonPhrase ());
      attrs.put ("code", status.value ());
      result.add (attrs);
    }

    return result;
  }

  @GetMapping ("/contentType")
  public Map<String, String> getContentType () {
    Map<String, String> data = new HashMap<> ();

    data.put ("JSON", MediaType.APPLICATION_JSON.toString ());
    data.put ("XML", MediaType.APPLICATION_XML.toString ());
    data.put ("HTML", MediaType.TEXT_HTML.toString ());
    data.put ("Text", MediaType.TEXT_PLAIN.toString ());

    return data;
  }

  @GetMapping
  @JsonView (Public.class)
  public List<EndPoint> getAll () {
    return endPointService.getAll ();
  }

  @GetMapping (params = "download")
  public ResponseEntity<String> downloadAll () {
    List<EndPoint> data = endPointService.getAll ();

    String json = "";

    try {
      json = objectMapper.writerWithDefaultPrettyPrinter ().withView (Internal.class).writeValueAsString (data);
    } catch (Exception e) {
      return ResponseEntity.unprocessableEntity ().body (e.getMessage ());
    }

    return ResponseEntity.ok ().header ("Content-Disposition", "attachment; filename=\"data.json\"").body (json);
  }

  @PostMapping
  @JsonView (Public.class)
  public ResponseEntity<EndPoint> createConfig (@RequestBody (required = false) EndPoint data,
                                                EndPoint params,
                                                UriComponentsBuilder ucb) {
    if (data == null && params == null) {
      return ResponseEntity.badRequest ().build ();
    } else if (data == null) {
      data = params;
    }

    if (!StringUtils.hasText (data.getPath ())) {
      return ResponseEntity.badRequest ().build ();
    }

    EndPoint created = endPointService.add (data);

    if (created != null) {
      UriComponents uc = ucb.path ("/config/{id}").buildAndExpand (created.getId ());
      return ResponseEntity.created (uc.toUri ()).body (created);
    } else {
      return ResponseEntity.badRequest ().build ();
    }
  }

  @PutMapping
  @JsonView (Public.class)
  public ResponseEntity<List<EndPoint>> updateConfig (@RequestBody (required = false) EndPoint data,
                                                      EndPoint params) {
    if (data == null && params == null) {
      return ResponseEntity.badRequest ().build ();
    } else if (data == null) {
      data = params;
    }

    Optional<List<EndPoint>> updated = endPointService.update (data);

    return ResponseEntity.of (updated);
  }

  @DeleteMapping
  @JsonView (Public.class)
  public ResponseEntity<EndPoint> removeConfig (@RequestParam String id) {
    return ResponseEntity.of (endPointService.remove (id));
  }

  @GetMapping ("/{id}")
  @JsonView (Public.class)
  public ResponseEntity<EndPoint> getConfigById (@PathVariable String id) {
    return ResponseEntity.of (endPointService.getById (id));
  }

  @GetMapping ("/{id}/request")
  public ResponseEntity<EndPointRequestData> getRequestLogByEndPoint (@PathVariable String id,
                                                                      @RequestParam (defaultValue = "5") int pageSize,
                                                                      @RequestParam (defaultValue = "1") int page) {
    Optional<EndPoint> endPoint = endPointService.getById (id);
    if (endPoint.isPresent ()) {
      return ResponseEntity.ok (endPoint.get ().getLoggedRequests (pageSize, page));
    } else {
      return ResponseEntity.notFound ().build ();
    }
  }

  @DeleteMapping ("/{id}/request")
  public ResponseEntity<EndPointRequestData> clearRequestLogsByEndPoint (@PathVariable String id) {
    Optional<EndPoint> endPoint = endPointService.getById (id);
    if (endPoint.isPresent ()) {
      EndPoint endPointActual = endPoint.get ();
      endPointActual.getLoggedRequests ().clear ();
      return ResponseEntity.ok ().build ();
    } else {
      return ResponseEntity.notFound ().build ();
    }
  }

  @PutMapping ("/{id}")
  @JsonView (Public.class)
  public ResponseEntity<List<EndPoint>> updateConfigById (@PathVariable String id,
                                                          @RequestBody EndPoint data) {
    data.setId (id);
    Optional<List<EndPoint>> updated = endPointService.update (data);

    return ResponseEntity.of (updated);
  }

  @DeleteMapping ("/{id}")
  @JsonView (Public.class)
  public ResponseEntity<EndPoint> removeConfigById (@PathVariable String id) {
    return removeConfig (id);
  }
}
