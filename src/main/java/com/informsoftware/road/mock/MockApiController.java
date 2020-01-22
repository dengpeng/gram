package com.informsoftware.road.mock;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

  Logger          log = LoggerFactory.getLogger (MockApiController.class);

  @Autowired
  EndPointService endPointService;

  @RequestMapping ("**")
  public ResponseEntity<?> catchAll (HttpServletRequest request) {
    RequestMethod method = RequestMethod.valueOf (request.getMethod ());
    String path = (String) request.getAttribute (HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
    String subPath = path.substring (6);

    Optional<EndPoint> endPoint = endPointService.getActiveByPathAndMethod (subPath, method);

    if (endPoint.isPresent ()) {
      EndPoint endPointActual = endPoint.get ();
      Long delay = endPointActual.getDelay ();

      if (delay != null && delay > 0) {
        try {
          Thread.sleep (delay);
        } catch (InterruptedException e) {
          log.error ("Delay of request is interrupted.", e);
        }
      }

      return ResponseEntity.status (endPointActual.getStatus ())
                           .contentType (endPointActual.getMediaType ())
                           .body (endPointActual.getResponse ());

    } else {
      return ResponseEntity.notFound ().build ();
    }
  }

}
