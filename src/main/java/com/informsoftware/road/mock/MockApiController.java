package com.informsoftware.road.mock;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionException;
import org.springframework.expression.ParserContext;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
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

  EndPointService endPointService;

  SpelExpressionParser spelParser;
  ParserContext parserContext;

  @Autowired
  public MockApiController (EndPointService endPointService,
                            @Value ("#{systemProperties['spel.prefix'] ?: '#{'}") String expressionPrefix,
                            @Value ("#{systemProperties['spel.suffix'] ?: '}'}") String expressionSuffix) {
    this.endPointService = endPointService;
    this.spelParser = new SpelExpressionParser ();
    this.parserContext = new TemplateParserContext (expressionPrefix, expressionSuffix);
  }

  @RequestMapping ("**")
  public ResponseEntity<?> catchAll (HttpServletRequest request) {
    RequestMethod method = RequestMethod.valueOf (request.getMethod ());
    String path = (String) request.getAttribute (HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
    String subPath = path.substring (6);

    Optional<EndPoint> endPoint = endPointService.getActiveByPathAndMethod (subPath, method);

    if (endPoint.isPresent ()) {
      EndPoint endPointActual = endPoint.get ();
      EndPointRequest loggedRequest = endPointActual.logRequest (request);

      Long delay = endPointActual.getDelay ();

      if (delay != null && delay > 0) {
        try {
          Thread.sleep (delay);
        } catch (InterruptedException e) {
          log.error ("Delay of request is interrupted.", e);
        }
      }

      String responseBody = endPointActual.getResponse();
      try {
        Expression expression = spelParser.parseExpression (responseBody, parserContext);
        responseBody = expression.getValue (loggedRequest, String.class);
      } catch (ExpressionException e) {
        log.error ("Fail to parse expression in response: " + responseBody);
        log.error (e.getMessage());
      }

      return ResponseEntity.status (endPointActual.getStatus ())
                           .contentType (endPointActual.getMediaType ())
                           .body (responseBody);
    } else {
      return ResponseEntity.notFound ().build ();
    }
  }

}
