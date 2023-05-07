import React,{useEffect} from 'react';
import { PaginationItem, Pagination,Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../../actions/posts';

export default function Pag() {
  const dispatch = useDispatch();
  const {numberOfPages, currentPage } = useSelector((state)=>state?.posts);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page");
  const urlQuery = searchParams.get("searchQuery");
  const urlTags = searchParams.getAll("searchTags");
  const searchQuery = urlQuery || null;
  const searchTags = urlTags?.join(",") || null;
  
  useEffect(() => {
   
      
      if (searchQuery || searchTags) {
        dispatch(getPostsBySearch({ searchQuery, searchTags }, page));
      } else {
        dispatch(getPosts(page));
      }
  
  }, [searchQuery,searchTags,dispatch,page]);


  return ( currentPage&&
       <Box borderRadius={3} p={1} sx={{backgroundColor:(theme)=>theme.palette.primary.dark}}>
      <Pagination  page={Number(page)} renderItem={(item) => <PaginationItem  to={!(searchQuery||searchTags)?`/posts?page=${item.page}`:`/posts/search?searchQuery=${searchQuery}&searchTags=${searchTags}&page=${item.page}`} component={Link} {...item} />} size='large' count={numberOfPages} defaultPage={1} color={'primary'} />
      </Box>
  )
}