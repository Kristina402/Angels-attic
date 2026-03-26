import React from "react";
import styled from "styled-components";

import { SearchOutlined, CloseOutlined } from "@mui/icons-material";

import "./Searchbar.css";

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 450px;
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 4px 12px;
  height: 44px;
  transition: all 0.3s ease;
  border: 1.5px solid transparent;

  &:focus-within {
    background-color: #fff;
    border-color: #1a1a1a;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  outline: none;
  background-color: transparent;
  border: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  color: #1a1a1a;
  padding: 8px 0;
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  transition: color 0.2s ease;
  padding: 4px;

  &:hover {
    color: #1a1a1a;
  }
`;




const Search = ({
  handleSearchButtonClick,
  handleCrossButtonClick,
  searchBarActive,
  handleSearchFormSubmit,
  handleSearchInputChange,
  searchValue,
}) => {
  return (
    <>
      {!searchBarActive && (
        <SearchButton onClick={handleSearchButtonClick}>
          <SearchOutlined fontSize="large" className="closeIcon" />
        </SearchButton>
      )}
        <SearchBar>
          <SearchButton onClick={handleSearchFormSubmit}>
            <SearchOutlined sx={{ fontSize: 20 }} />
          </SearchButton>
          <form onSubmit={handleSearchFormSubmit} className="search_from" style={{ flex: 1, display: 'flex' }}>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={handleSearchInputChange}
            />
          </form>
          {searchValue && (
            <SearchButton onClick={handleCrossButtonClick}>
              <CloseOutlined sx={{ fontSize: 20 }} />
            </SearchButton>
          )}
        </SearchBar>
    </>
  );
};

export default Search;
