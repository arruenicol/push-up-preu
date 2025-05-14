import React from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
    const navigate = useNavigate();

    return (
        <header class="uc-header">
            <div id="uc-global-topbar-ucchile"></div>
            <nav class="uc-navbar navbar-dark">
                <div class="container d-none d-lg-block">
                <div class="row">
                    <div class="col-lg-4 col-xl-3 pr-40">
                    <img
                        src="https://kit-digital-uc-prod.s3.amazonaws.com/assets/logo-uc-chile-blanco.svg"
                        alt="Pontificia Universidad Católica de Chile"
                        class="img-fluid"
                    />
                    </div>
                    <div class="col-lg-7 col-xl-9 pl-44">
                    <div class="h2 text-font--serif color-white mt-40">
                        Preu UC
                    </div>
                    <div class="color-white p-size--lg">
                        Lorem ipsum dolor sit amet.
                    </div>
                    </div>
                </div>
                <ul class="uc-navbar_nav">
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 1</a>
                    </li>
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 2</a>
                    </li>
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 3</a>
                    </li>
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 4</a>
                    </li>
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 5</a>
                    </li>
                    <li class="nav-item">
                    <a href="#" class="uc-btn btn-inline">Item 6</a>
                    </li>
                </ul>
                </div>
                
                {/*Menú para versión Móvil*/}
                <div class="uc-navbar_mobile navbar_mobile-slide d-block d-lg-none">
                <div class="uc-navbar_mobile-bar navbar-brand">
                    <div class="uc-navbar_mobile-logo navbar-light">
                    <div class="h2 text-font--serif text-color--blue color-white">
                        Lorem, ipsum dolor.
                    </div>
                    </div>
                    <a href="javascript:void(0);" class="uc-navbar_mobile-button">
                    <span class="uc-icon"></span>
                    </a>
                </div>
                <div class="uc-navbar_mobile-content">
                    <ul class="uc-navbar_mobile-list">
                    <li class="list-item has-list-children">
                        <a class="list-open" href="#">
                        Pregrado
                        <i class="uc-icon icon-size--sm">arrow_forward_ios</i>
                        </a>
                        <ul class="list-item list-children">
                        <li class="list-item">
                            <a href="#" class="list-close">
                            <div class="uc-icon icon-size--sm">arrow_back_ios</div>
                            Pregrado
                            </a>
                        </li>
                        {/*-- loop de elementos*/}
                        <li class="list-item has-list-children">
                            <a href="#" class="list-open">
                            Item 1
                            <i class="uc-icon icon-size--sm">arrow_forward_ios</i>
                            </a>
                            <ul class="list-children">
                            <li class="list-item">
                                <a href="#" class="list-close text-color--gray">
                                <span class="uc-icon">arrow_back_ios</span>
                                Item child
                                </a>
                            </li>
                            <li class="list-item">
                                <a href="/">Item child</a>
                            </li>
                            <li class="list-item">
                                <a href="/">Item child</a>
                            </li>
                            </ul>
                        </li>
                        <li class="list-item">
                            <a href="/">
                            Item child
                            <i class="uc-icon">launch</i>
                            </a>
                        </li>
                        <li class="list-item">
                            <a href="/">Item child</a>
                        </li>
                        <li class="list-item">
                            <a href="/">Item child</a>
                        </li>
                        </ul>
                    </li>
                    <li class="list-item">
                        <a href="#">Item 2</a>
                    </li>
                    <li class="list-item has-list-children">
                        <a class="list-open" href="#">
                        Desplegable 2
                        <i class="uc-icon icon-size--sm">arrow_forward_ios</i>
                        </a>
                        <ul class="list-item list-children">
                        <li class="list-item">
                            <a href="#" class="list-close">
                            <div class="uc-icon icon-size--sm">arrow_back_ios</div>
                            Desplegable 2
                            </a>
                        </li>
                        {/*loop de elementos */}
                        <li class="list-item">
                            <a href="#">Item 1</a>
                        </li>
                        <li class="list-item">
                            <a href="#">Item 2</a>
                        </li>
                        <li class="list-item">
                            <a href="#">Item 3</a>
                        </li>
                        </ul>
                    </li>
                    <li class="list-item">
                        <a href="#">Item 4</a>
                    </li>
                    <li class="list-item">
                        <a href="#">Item 5</a>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        </header>

    )
}