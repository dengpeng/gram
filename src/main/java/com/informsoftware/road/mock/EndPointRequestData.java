package com.informsoftware.road.mock;

import java.util.List;

/**
 * EndPointRequest
 */
public class EndPointRequestData {

  private List<EndPointRequest> data;
  private int                   totalPages;
  private int                   totalRecords;
  private int                   currentPage;
  private int                   pageSize;

  public EndPointRequestData (List<EndPointRequest> data,
                              int totalRecords,
                              int totalPages,
                              int currentPage,
                              int pageSize) {
    this.data = data;
    this.totalRecords = totalRecords;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }

  public List<EndPointRequest> getData () {
    return data;
  }

  public void setData (List<EndPointRequest> data) {
    this.data = data;
  }

  public int getTotalPages () {
    return totalPages;
  }

  public void setTotalPages (int totalPages) {
    this.totalPages = totalPages;
  }

  public int getCurrentPage () {
    return currentPage;
  }

  public void setCurrentPage (int currentPage) {
    this.currentPage = currentPage;
  }

  public int getPageSize () {
    return pageSize;
  }

  public void setPageSize (int pageSize) {
    this.pageSize = pageSize;
  }

  public int getTotalRecords () {
    return totalRecords;
  }

  public void setTotalRecords (int totalRecords) {
    this.totalRecords = totalRecords;
  }

}
