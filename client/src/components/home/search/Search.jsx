    import React, {  useState } from "react";
    import { Grid, Button, Grow, TextField,Box } from "@mui/material";
    import ClickAwayListener from "@mui/base/ClickAwayListener";
    import { useNavigate } from "react-router-dom";
    import SearchIcon from "@mui/icons-material/Search";
    import TagIcon from '@mui/icons-material/Tag';
    import { MuiChipsInput } from 'mui-chips-input';
    import { useSelector } from "react-redux";


    export default function Search() {
    const { currentPage } = useSelector((state)=> state?.posts);
    const navigate = useNavigate();
    const [expand, setExpand] = useState(false);
    const [expandTag, setExpandTag] = useState(false);
    const [search, setSearch] = useState("");
    const [chips, setChips] = useState([]);
    const [chipInput, setChipInput] = useState("");
    const page = 1;
    const searchPosts = () => {
      
        const searchQuery = search?.trim() || null;
        const searchTags = chips?.join(",") ||  null;

        if (searchQuery || searchTags) {
          navigate(`/posts/search?searchQuery=${searchQuery}&searchTags=${searchTags}&page=${page}`);
        } else {
          navigate("/posts?page=1");
        }
        
      };

    const handleChange = (newChips) => {
        setChips(newChips);
        setChipInput("");
    }
    const handleChipInput = (e) => {
        setChipInput(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
        searchPosts();
        }
    };
    const handleExpand = () => {
        if (!expand) {
            setExpand(true);
        }else{
            searchPosts();
        }
    };
    const handleExpand2 = () => {
        if (search.length === 0) {
        setExpand(false);
        }
    }
        const handleExpandTag = () => {
            if (!expandTag) {
                setExpandTag(true);
            }else{
                searchPosts();
            }
        };
        const handleExpandTag2 = () => {
            if (!chips.length && !chipInput.length) {
            setExpandTag(false);
            }
        }
    
    return (
       currentPage &&
        <Box >
        <Grid  container spacing={2} >
        <ClickAwayListener onClickAway={handleExpand2}>
        <Grid item xs={12}>
        <Box display="flex" maxWidth={"md"} justifyContent="center" m="auto">
            <Button onClick={handleExpand} sx={{ p: 0, borderRadius: 5 }}>
            <SearchIcon fontSize="large" />
            </Button>
            {expand && (
            <Grow in>
                <TextField
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                value={search}
                autoFocus
                fullWidth
                sx={{ mr: 3, ml:1 }}
                variant="standard"
                ></TextField>
            </Grow>
            )}
            </Box>
        </Grid>
        </ClickAwayListener>
        <ClickAwayListener onClickAway={handleExpandTag2}>
        <Grid pb={2} item xs={12}>
        <Box maxWidth={"md"} display="flex" justifyContent="center" m="auto" xs={12}>
            <Button onClick={handleExpandTag} sx={{ p: 0, borderRadius: 5 }}>
            <TagIcon color="primary" fontSize="large" />
            </Button>
            {expandTag && (
                <MuiChipsInput color="primary" autoFocus onInput={(e)=>handleChipInput(e)} inputValue={chipInput} sx={{ml:1, mr:3}}  variant="standard" placeholder="Search by tags" fullWidth value={chips} onChange={handleChange} />
            )}
        </Box>
        </Grid>
        </ClickAwayListener>
    </Grid>
    </Box>
        
    );
    }
