import React from 'react';

import './index.scss';

export function Section({ children, className}) {
    return <section className={'kto-layout-section' + ' ' + className}>
        {children}
    </section>
}

export function Container({ children }) {
    return <div className="kto-layout-container">
        {children}
    </div>
}