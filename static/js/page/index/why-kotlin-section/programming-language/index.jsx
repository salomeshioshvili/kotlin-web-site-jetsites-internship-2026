import React, {useEffect, useMemo, useState} from 'react';
import Button from '@rescui/button';
import {useTextStyles} from '@rescui/typography';
import {TabList, Tab, TabSeparator} from '@rescui/tab-list';
import cn from 'classnames';
import hljs from 'highlight.js/lib/core';
import kotlin from 'highlight.js/lib/languages/kotlin';

import {tabs} from './data';

import 'highlight.js/styles/github.css';
import './index.scss';

hljs.registerLanguage('kotlin', kotlin);

export function ProgrammingLanguage() {
    const textCn = useTextStyles();
    const [activeIndex, setActiveIndex] = useState(0);

    // On the server, render with the first tab selected so output is consistent.
    // After the page loads on the client, randomly pick a tab to match the original behavior.
    useEffect(() => {
        setActiveIndex(Math.floor(Math.random() * tabs.length));
    }, []);

    const highlighted = useMemo(() => {
        // highlight.js expects (language, code, ignoreIllegalRules)
        const result = hljs.highlight('kotlin', tabs[activeIndex].code, false);
        return result.value;
    }, [activeIndex]);

    return (
        <div className="kto-grid kto-grid-gap-32 kto-offset-top-96 kto-offset-top-md-48">
            <div className="kto-col-4 kto-col-md-12">
                <h3 className={textCn('rs-h2')}>
                    Modern, concise and safe programming language
                </h3>
                <p className={cn(textCn('rs-text-2'), 'kto-offset-top-32')}>
                    Easy to pick up, so you can create powerful applications immediately.
                </p>
                <div className="kto-offset-top-32">
                    <Button mode="outline" size="l" href="/docs/getting-started.html">
                        Get started
                    </Button>
                </div>
            </div>

            <div className="kto-col-8 kto-col-md-12">
                <TabList value={activeIndex} onChange={v => setActiveIndex(v)}>
                    {tabs.map((tab, i) => (
                        <Tab key={i}>{tab.title}</Tab>
                    ))}
                </TabList>
                <TabSeparator/>
                <pre className="programming-language__code kto-offset-top-16">
                    <code className="hljs" dangerouslySetInnerHTML={{__html: highlighted}} />
                </pre>
            </div>
        </div>
    );
}

