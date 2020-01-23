package com.informsoftware.road.mock;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

  @Autowired
  public void setEndPointService (EndPointService endPointService) {
    this.endPointService = endPointService;
  }

  @GetMapping
  public List<EndPoint> getAll () {
    return endPointService.getAll ();
  }

  @GetMapping(params = "download")
  public ResponseEntity<List<EndPoint>> downloadAll () {
    List<EndPoint> data = endPointService.getAll ();

    return ResponseEntity.ok()
                         .header ("Content-Disposition", "attachment; filename=\"data.json\"")
                         .body (data);
  }

  @PostMapping
  public ResponseEntity<EndPoint> createConfig (EndPoint data,
                                                UriComponentsBuilder ucb) {
    if (StringUtils.isEmpty (data.getPath ())) {
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
  public ResponseEntity<EndPoint> updateConfig (EndPoint data) {
    Optional<EndPoint> updated = endPointService.update (data);

    return ResponseEntity.of (updated);
  }

  @DeleteMapping
  public ResponseEntity<EndPoint> removeConfig (@RequestParam String id) {
    endPointService.remove (id);
    return ResponseEntity.ok ().build ();
  }

  @GetMapping ("/{id}")
  public ResponseEntity<EndPoint> getConfigById (@PathVariable String id) {
    return ResponseEntity.of (endPointService.getById (id));
  }

  @PutMapping ("/{id}")
  public ResponseEntity<EndPoint> updateConfigById (@PathVariable String id, 
                                                    EndPoint data) {
    data.setId (id);
    Optional<EndPoint> updated = endPointService.update (data);

    return ResponseEntity.of (updated);
  }

  @DeleteMapping ("/{id}")
  public ResponseEntity<EndPoint> deleteConfigById (@PathVariable String id) {
    try {
      endPointService.remove (id);
      return ResponseEntity.ok ().build ();
    } catch (Exception e) {
      return ResponseEntity.unprocessableEntity().build();
    }
  }
}
