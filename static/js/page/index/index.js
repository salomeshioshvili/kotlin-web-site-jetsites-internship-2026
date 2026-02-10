import React from 'react';
import ReactDOM from 'react-dom';
import '@rescui/typography/lib/font-jb-sans-auto.css';

import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';
import 'highlight.js/styles/github.css';
hljs.registerLanguage('kotlin', kotlin);

import {ThemeProvider} from '@rescui/ui-contexts';

import {HeaderSection} from './header-section';
import {LatestFromKotlinSection} from './latest-from-kotlin-section';
import {WhyKotlinSection} from './why-kotlin-section';
import {UsageSection} from './usage-section';
import {StartSection} from './start-section';

import '../index/index.scss';
import '../../../css/grid.scss'

function OverviewPageContent() {
    return <div className="overview-page">
        <HeaderSection/>
        <LatestFromKotlinSection/>
        <WhyKotlinSection/>
        <UsageSection/>
        <StartSection/>
    </div>
}

export const OverviewPage = () => (
    <ThemeProvider theme="dark">
        <OverviewPageContent/>
    </ThemeProvider>
)

const container = document.getElementById('react-app')

ReactDOM.render(<OverviewPage/>, container);
