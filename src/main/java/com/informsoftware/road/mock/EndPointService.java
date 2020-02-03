package com.informsoftware.road.mock;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * DemoService
 */
@Service
public class EndPointService {

  static final Logger   log               = LoggerFactory.getLogger (EndPointService.class);
  static final String   DEFAULT_DATA_FILE = "data.json";

  Map<String, EndPoint> endPointMap       = new ConcurrentHashMap<> ();
  ObjectMapper          objectMapper;

  @Autowired
  public EndPointService (ApplicationArguments args,
                          ObjectMapper objectMapper,
                          @Value ("classpath:demo-data.json") Resource demoDataResource) {
    this.objectMapper = objectMapper;

    List<String> dataFiles = args.getOptionValues ("data");
    String dataFileName = DEFAULT_DATA_FILE;
    if (dataFiles != null && dataFiles.size () > 0) {
      dataFileName = dataFiles.get (0);
    }

    ApplicationHome home = new ApplicationHome (this.getClass ());
    File dataFile = new File (home.getDir (), dataFileName);

    if (dataFile != null && dataFile.exists ()) {
      try {
        loadData (new FileInputStream (dataFile));
      } catch (FileNotFoundException e) {
        log.error ("Cannot find file " + dataFile.getName (), e);
      }
    } else {
      log.warn ("[Data] Data file " + dataFile.getName () + " doesn't exist. Demo data will be loaded");
      try {
        loadData (demoDataResource.getInputStream ());
      } catch (IOException e) {
        log.error ("Fail to load demo data", e);
      }
    }
  }

  private void loadData (InputStream inputStream) {
    try {
      List<EndPoint> data = objectMapper.readValue (inputStream, new TypeReference<List<EndPoint>> () {
      });
      data.stream ().forEach (item -> add (item));
      log.info (String.format ("[Data] %d data items loaded.", data.size ()));

    } catch (JsonParseException | JsonMappingException e) {
      log.error ("Fail to parse JSON data from input stream", e);

    } catch (IOException e) {
      log.error ("Fail to load data from input stream", e);
    }
  }

  public EndPoint add (EndPoint data) {
    if (data.getMediaType () == null) {
      data.setMediaType (MediaType.APPLICATION_JSON);
    }

    if (data.getMethod () == null) {
      data.setMethod (RequestMethod.GET);
    }

    if (data.getStatus () == null) {
      data.setStatus (HttpStatus.OK);
    }

    if (data.getDelay () == null) {
      data.setDelay (0L);
    }

    if (!getActiveByPathAndMethod (data.getPath (), data.getMethod ()).isPresent ()) {
      data.setActive (true);
    } else {
      data.setActive (false);
    }

    endPointMap.put (data.getId (), data);

    return data;
  }

  public EndPoint create (String path,
                          String response,
                          HttpStatus status,
                          RequestMethod method,
                          MediaType mediaType,
                          Long delay) {
    EndPoint newItem = new EndPoint (path, response, status, method, mediaType, delay);

    return add (newItem);
  }

  public Optional<List<EndPoint>> update (EndPoint data) {
    return update (data.getId (),
                   data.getPath (),
                   data.getResponse (),
                   data.getStatus (),
                   data.getMethod (),
                   data.getMediaType (),
                   data.getDelay (),
                   data.isActive ());
  }

  public Optional<List<EndPoint>> update (String id,
                                          String path,
                                          String response,
                                          HttpStatus status,
                                          RequestMethod method,
                                          MediaType mediaType,
                                          Long delay,
                                          boolean active) {
    Optional<EndPoint> endPoint = getById (id);
    List<EndPoint> endPoints = new ArrayList<> ();

    endPoint.ifPresent (item -> {
      item.setPath (path);
      item.setResponse (response);
      item.setStatus (status);
      item.setMethod (method);
      item.setMediaType (mediaType);
      item.setDelay (delay);

      if (active && !item.isActive ()) {
        getActiveByPathAndMethod (item.getPath (), item.getMethod()).ifPresent (other -> {
          other.setActive (false);
          endPoints.add (other);
        });
      }

      item.setActive (active);

      endPoints.add (item);
    });

    return endPoints.isEmpty () ? Optional.empty () : Optional.of (endPoints);
  }

  public Optional<EndPoint> remove (String id) {
    return Optional.ofNullable(endPointMap.remove (id));
  }

  public List<EndPoint> getAll () {
    return new ArrayList<> (endPointMap.values ());
  }

  public Optional<EndPoint> getById (String id) {
    return Optional.ofNullable (endPointMap.get (id));
  }

  public Optional<EndPoint> getActiveByPath (String path) {
    return endPointMap.values ()
                      .stream ()
                      .filter (e -> path != null && path.equals (e.getPath ()) && e.isActive ())
                      .findFirst ();
  }

  public Optional<EndPoint> getActiveByPathAndMethod (String path,
                                                      RequestMethod method) {
    return endPointMap.values ()
                      .stream ()
                      .filter (e -> e.isActive () && path != null && path.equals (e.getPath ()) && method != null
                          && method.equals (e.getMethod ()))
                      .findFirst ();
  }
}
