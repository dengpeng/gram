package com.informsoftware.road.mock;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * DemoService
 */
@Service
public class EndPointService {

  static final Logger log = LoggerFactory.getLogger(EndPointService.class);

  Map<String, EndPoint> endPointMap = new ConcurrentHashMap<> ();
  File                  dataFile;
  ObjectMapper objectMapper;

  @Autowired
  public EndPointService (ApplicationArguments args, ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;

    List<String> dataFiles = args.getOptionValues ("data");
    String dataFileName = "config.json";
    if (dataFiles != null && dataFiles.size () > 0) {
      dataFileName = dataFiles.get (0);
    }

    ApplicationHome home = new ApplicationHome(this.getClass());

    dataFile = new File(home.getDir(), dataFileName);
  }

  @PostConstruct
  protected void loadDataFromFile () {
    if (dataFile != null && dataFile.exists()) {
      try {
        log.info("Loading data from file " + dataFile.getName());
        List<EndPoint> data = objectMapper.readValue(dataFile, new TypeReference<List<EndPoint>>() {
        });
        data.stream().forEach(item -> add(item));
        log.info(String.format("%d data items loaded.", data.size()));

      } catch (JsonParseException | JsonMappingException e) {
        log.error ("Fail to parse JSON data from file " + dataFile.getName(), e);
      
      } catch (IOException e) {
        log.error ("Fail to load data from file " + dataFile.getName(), e);
      }
    } else {
      log.warn ("Data file " + dataFile.getName() + " doesn't exist. No data loaded");
    }
  }

  public EndPoint add (EndPoint data) {
    if (data.getMediaType() == null) {
      data.setMediaType(MediaType.APPLICATION_JSON);
    }

    if (data.getMethod() == null) {
      data.setMethod(RequestMethod.GET);
    }

    if (data.getStatus() == null) {
      data.setStatus(HttpStatus.OK);
    }

    if (!getActiveByUriAndMethod(data.getUri(), data.getMethod()).isPresent()) {
      data.setActive(true);
    }

    endPointMap.put (data.getId (), data);

    return data;
  }

  public EndPoint create(String uri, String response, HttpStatus status, RequestMethod method, MediaType mediaType) {
    EndPoint newItem = new EndPoint(uri, response, status, method, mediaType);
  
    return add(newItem);
  }

  public Optional<EndPoint> update (EndPoint data) {
    return update (data.getId(), data.getUri(), data.getResponse(), data.getStatus(), data.getMethod(), data.getMediaType(), data.isActive());
  }

  public Optional<EndPoint> update (String id, String uri, String response, HttpStatus status, RequestMethod method, MediaType mediaType, boolean active) {
    Optional<EndPoint> endPoint = getById (id);

    endPoint.ifPresent(item -> {
      item.setUri(uri);
      item.setResponse(response);
      item.setStatus(status);
      item.setMethod(method);
      item.setMediaType(mediaType);

      if (active && !item.isActive()) {
        getActiveByUri(item.getUri()).ifPresent(other -> {
          other.setActive(false);
        });
        item.setActive(active);
      }
    });

    return endPoint; 
  }

  public void remove (String id) {
    endPointMap.remove(id);
  }

  public List<EndPoint> getAll () {
    return new ArrayList<>(endPointMap.values());
  }

  public Optional<EndPoint> getById (String id) {
    return Optional.ofNullable(endPointMap.get(id));
  }

  public Optional<EndPoint> getActiveByUri (String uri) {
    return endPointMap.values().stream().filter(e -> uri != null && uri.equals(e.getUri()) && e.isActive()).findFirst();
  }

  public Optional<EndPoint> getActiveByUriAndMethod (String uri, RequestMethod method) {
    return endPointMap.values().stream().filter(e -> e.isActive() && uri != null && uri.equals(e.getUri()) && method != null && method.equals(e.getMethod())).findFirst();
  }
}