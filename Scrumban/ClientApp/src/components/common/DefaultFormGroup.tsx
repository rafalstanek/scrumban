import * as React from 'react';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';

export interface Option {
    value: any;
    disabled: boolean;
    text: string;
}

interface InputProps {
    label: string;
    type?: InputType;
    onChangeEvent?: (e: any) => void;
    error: string;
    options?: Option[];
    value?: any;
}

const DefaultFormGroup: React.FunctionComponent<InputProps> = (props) =>
    <FormGroup>
        <Label>{props.label}</Label>
        <Input
            type={props.type}
            value={props.value}
            onChange={props.onChangeEvent}
            invalid={props.error.length > 0}>
            {props.options && props.options.map(
                (x, i) => <option value={x.value} disabled={x.disabled} key={i}>
                    {x.text}
                </option>)}
        </Input>
        <FormFeedback>
            {props.error}
        </FormFeedback>
    </FormGroup>;

export default DefaultFormGroup;