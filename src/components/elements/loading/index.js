import React,{ useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { CircularProgress } from '@mui/material';

const View = (props) => {

    const { } = props;

    return (
        <LoadingContainer>
            <CircularProgress size={70} style={{ color: "#006FE5" }} />
        </LoadingContainer>
    )
}

export default (View);

const LoadingContainer = styled.div`
width: 100%;
text-align: center;
position: fixed; /* Sit on top of the page content */
width: 100%; /* Full width (cover the whole page) */
height: 100%; /* Full height (cover the whole page) */
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(255,255,255,0.6); /* Black background with opacity */
z-index: 999; /* Specify a stack order in case you're using a different order for other elements */
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
`
