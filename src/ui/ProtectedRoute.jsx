import { useUser } from "../features/authentication/useUser.js";
import Spinner from "./Spinner.jsx";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
    height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate()

    // 1. Load the authenticated user
    const { isLoading, isAuthenticated, fetchStatus } = useUser()

    // 2. If there is NO authenticated user, redirect to the login page.
    useEffect(function () {
        if (!isAuthenticated && !isLoading && fetchStatus !== "fetching") navigate('/login')
    }, [isAuthenticated, isLoading, navigate])

    // 3. While loading, show a spinner
    if (isLoading) return (
        <FullPage>
            <Spinner />
        </FullPage>
    )


    // 4.  If there is a user, render the app
    if (isAuthenticated) return children
}