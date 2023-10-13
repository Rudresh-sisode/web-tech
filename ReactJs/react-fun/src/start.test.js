import {render} from '@testing-library/react';

test("render on h1",()=>{
    const {getByText} = render(<Start/>);
    const h1 = getByText(/Cool start/i);
    expect(h1).toHaveTextContent("Cool start");
})