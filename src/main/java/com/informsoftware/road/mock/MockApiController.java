package com.informsoftware.road.mock;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

/**
 * DemoController
 */
@RestController
@RequestMapping ("/mock/")
public class MockApiController {

  @Autowired
  EndPointService endPointService;

  @RequestMapping ("**")
  public ResponseEntity<?> catchAll (HttpServletRequest request) {
    RequestMethod method = RequestMethod.valueOf(request.getMethod());
    String path = (String) request.getAttribute (HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
    String uri = path.substring (6);

    Optional<EndPoint> endPoint = endPointService.getActiveByUriAndMethod (uri, method);

    if (endPoint.isPresent ()) {
      EndPoint endPointActual = endPoint.get();
      return ResponseEntity.status(endPointActual.getStatus())
                           .contentType (endPointActual.getMediaType())
                           .body (endPointActual.getResponse ());

    } else {
      return ResponseEntity.notFound().build();
    }
  }

}
