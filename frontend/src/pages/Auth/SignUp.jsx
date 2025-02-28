import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsKey, BsPerson, BsExclamationCircle } from "react-icons/bs";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helpers";
import { API_PATHS } from "../../utils/apiPaths";

import { toast } from "react-hot-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Entrer votre nom votre nom.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Entrer une adresse email valide.");
      return;
    }

    if (!password) {
      setError("Entrer le mot de passe.");
      return;
    }
    if (!passwordConfirm) {
      setError("Confirmer le mot de passe.");
      return;
    }
    if (passwordConfirm !== password) {
      setError(
        "Le mot de passe et celui de confirmation ne sont pas identique."
      );
      return;
    }

    setError("");

    // Login API Call
    try {
      const data = { name, email, password };
      setProcessing(true);

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, data);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);
        navigate("/");
        toast.success("S'inscrie avec succès!");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur s'est produite, veuillez réessayer.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ width: "400px" }}>
            <h3 className="text-center mb-3">S'inscrire</h3>

            <div className="form-floating mb-2">
              <input
                type="text"
                className={`form-control`}
                id="name"
                placeholder="Nom d'utilisateur"
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
              <label htmlFor="name">
                <BsPerson className="me-1" />
                Nom d'utilisateur
              </label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="email"
                className={`form-control`}
                id="email"
                placeholder="E-Mail de l'utilisateur"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
              <label htmlFor="email">
                <BsPerson className="me-1" />
                E-Mail de l'utilisateur
              </label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="password"
                className={`form-control`}
                id="password"
                placeholder="Mot de passe"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              <label htmlFor="name">
                <BsKey className="me-1" />
                Mot de passe
              </label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="password"
                className={`form-control`}
                id="passwordConfirm"
                placeholder="Mot de passe"
                value={passwordConfirm}
                onChange={({ target }) => setPasswordConfirm(target.value)}
              />
              <label htmlFor="passwordConfirm">
                <BsKey className="me-1" />
                Confirmation mot de passe
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-sm btn-outline-primary mt-2 w-100`}
              disabled={processing}
            >
              <div className="d-flex justify-content-center align-items-center">
                {processing && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                {processing ? "Processing..." : "S'inscrire"}
              </div>
            </button>

            <div className="fw-light fst-italic">
              <p className="d-flex gap-1 mt-3 justify-content-center">
                Vous avez déjà un compte ?
                <Link
                  to={"/login"}
                  className="nav-link text-primary fst-italic"
                >
                  Se connecter
                </Link>
              </p>

              <div className="d-flex gap-1 align-items-center">
                <hr className="w-25 mx-auto my-1" />
                <small>Ou</small>
                <hr className="w-25 mx-auto my-1" />
              </div>

              <p className="d-flex gap-1 justify-content-center">
                Allez vers la page
                <Link to={"/"} className="nav-link text-primary fst-italic">
                  Accueil
                </Link>
              </p>
            </div>

            <div className="" style={{ height: "60px" }}>
              {error && (
                <div
                  className="d-flex align-items-center alert alert-danger w-100 py-2"
                  role="alert"
                >
                  <BsExclamationCircle className="me-2" />
                  <small className="text-danger-emphasis fst-italic fw-light">
                    {error}
                  </small>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
