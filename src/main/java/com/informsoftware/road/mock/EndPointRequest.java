package com.informsoftware.road.mock;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

/**
 * EndPointRequest
 */
public class EndPointRequest {

  static final Logger               log = LoggerFactory.getLogger (EndPoint.class);

  private long                      timeStamp;
  private String                    remoteAddress;
  private Map<String, List<String>> queryParams; 
  private String                    body;

  public EndPointRequest (HttpServletRequest request) {
    timeStamp = System.currentTimeMillis ();
    remoteAddress = request.getRemoteAddr ();
    
    String queryString = request.getQueryString ();
    queryParams = new HashMap<>();

    if (!StringUtils.isEmpty(queryString)) {
      Arrays.stream(queryString.split("&")).forEach(kvp -> {
        String[] keyValue = kvp.split ("=");
        if (keyValue.length > 0) {
          String key = keyValue[0];
          if (!queryParams.containsKey(key)) {
            queryParams.put(key, new ArrayList<>());
          }
          if (keyValue.length > 1) {
            queryParams.get(key).add(keyValue[1]);
          }
        }
      });
    }

    try {
      body = request.getReader ().lines ().collect (Collectors.joining (System.lineSeparator ()));
    } catch (IOException e) {
      log.error("IOException while reading request body", e);
    }
  }
  
  public long getTimeStamp () {
    return timeStamp;
  }

  public void setTimeStamp (long timeStamp) {
    this.timeStamp = timeStamp;
  }

  public String getRemoteAddress () {
    return remoteAddress;
  }

  public void setRemoteAddress (String remoteAddress) {
    this.remoteAddress = remoteAddress;
  }
  
  public String getBody () {
    return body;
  }

  public Map<String, List<String>> getQueryParams () {
    return queryParams;
  }
}
