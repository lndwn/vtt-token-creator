import { Dispatch } from "react";

export type PreviewFillMode = "fit" | "cover";

export type Density = "1x" | "2x" | "3x" | "4x";

export type BgMode = "hex" | "transparent" | "guess" | "pick";

export type Pos = string;

export interface OutputOptions {
  fillMode: PreviewFillMode;
  outputWidth: string;
  outputHeight: string;
  outputDensity: Density;
  bgMode: BgMode;
  bgColor: string | null;
  /** numpad positioning */
  position: Pos;
  scale: string;
  mask: boolean;
  offsetX: string;
  offsetY: string;
}

export const defaultOutputOptions: OutputOptions = {
  fillMode: "fit",
  outputDensity: "1x",
  outputWidth: "200",
  outputHeight: "200",
  bgMode: "transparent",
  bgColor: null,
  position: "5",
  scale: "100",
  mask: true,
  offsetX: "0",
  offsetY: "0"
};

interface OptionsViewProps {
  outputOptions: OutputOptions;
  setOutputOptions: Dispatch<React.SetStateAction<OutputOptions>>;
}

export const OptionsView = (props: OptionsViewProps) => {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value: rawValue, checked } = event.target;

    let value: string | boolean = rawValue;

    if (name === "mask") {
      value = checked;
    }

    props.setOutputOptions({
      ...props.outputOptions,
      [name]: value
    });
  }

  const handleOffsetResetClick = () =>
    props.setOutputOptions((o) => ({
      ...o,
      offsetX: defaultOutputOptions.offsetX,
      offsetY: defaultOutputOptions.offsetY
    }));

  return (
    <>
      <fieldset>
        <legend>Resolution</legend>
        <label>
          <span>Width</span>
          <input
            name="outputWidth"
            value={props.outputOptions.outputWidth}
            onChange={handleChange}
          />
          <span>px</span>
        </label>
        <label>
          <span>Height</span>
          <input
            name="outputHeight"
            value={props.outputOptions.outputWidth}
            onChange={handleChange}
            disabled={true}
          />
          <span>px</span>
        </label>
      </fieldset>
      <hr />
      <div className="grid-3-up">
        <fieldset>
          <legend>Mask</legend>
          <label>
            <input
              name="mask"
              type="checkbox"
              checked={props.outputOptions.mask}
              onChange={handleChange}
            />
            <span>Mask</span>
          </label>
        </fieldset>
        <fieldset>
          <legend>Fill Mode</legend>
          <label>
            <input
              name="fillMode"
              type="radio"
              value="fit"
              checked={props.outputOptions.fillMode === "fit"}
              onChange={handleChange}
            />
            <span>Fit</span>
          </label>
          <label>
            <input
              name="fillMode"
              type="radio"
              value="cover"
              checked={props.outputOptions.fillMode === "cover"}
              onChange={handleChange}
            />
            <span>Cover</span>
          </label>
        </fieldset>
        <fieldset>
          <legend>Position</legend>
          <div className="options-position-grid">
            <input
              type="radio"
              name="position"
              value="7"
              onChange={handleChange}
              checked={props.outputOptions.position === "7"}
            />
            <input
              type="radio"
              name="position"
              value="8"
              onChange={handleChange}
              checked={props.outputOptions.position === "8"}
            />
            <input
              type="radio"
              name="position"
              value="9"
              onChange={handleChange}
              checked={props.outputOptions.position === "9"}
            />
            <input
              type="radio"
              name="position"
              value="4"
              onChange={handleChange}
              checked={props.outputOptions.position === "4"}
            />
            <input
              type="radio"
              name="position"
              value="5"
              onChange={handleChange}
              checked={props.outputOptions.position === "5"}
            />
            <input
              type="radio"
              name="position"
              value="6"
              onChange={handleChange}
              checked={props.outputOptions.position === "6"}
            />
            <input
              type="radio"
              name="position"
              value="1"
              onChange={handleChange}
              checked={props.outputOptions.position === "1"}
            />
            <input
              type="radio"
              name="position"
              value="2"
              onChange={handleChange}
              checked={props.outputOptions.position === "2"}
            />
            <input
              type="radio"
              name="position"
              value="3"
              onChange={handleChange}
              checked={props.outputOptions.position === "3"}
            />
          </div>
        </fieldset>
      </div>
      <hr />
      <fieldset>
        <legend>Scale</legend>
        <label>
          <input
            name="scale"
            type="range"
            min="0"
            max="400"
            step="5"
            value={props.outputOptions.scale}
            onChange={handleChange}
          />
          <span>{props.outputOptions.scale}%</span>
        </label>
      </fieldset>
      <hr />
      <fieldset>
        <legend>Offset</legend>
        <label>
          <span>Offset X</span>
          <input
            name="offsetX"
            type="range"
            min={(
              parseInt(props.outputOptions.outputWidth, 10) * -1
            ).toString()}
            max={parseInt(props.outputOptions.outputWidth, 10).toString()}
            value={props.outputOptions.offsetX}
            onChange={handleChange}
          />
          <span>{props.outputOptions.offsetX}px</span>
        </label>
        <label>
          <span>Offset Y</span>
          <input
            name="offsetY"
            type="range"
            min={(
              parseInt(props.outputOptions.outputWidth, 10) * -1
            ).toString()}
            max={parseInt(props.outputOptions.outputWidth, 10).toString()}
            value={props.outputOptions.offsetY}
            onChange={handleChange}
          />
          <span>{props.outputOptions.offsetY}px</span>
        </label>
        <button type="button" onClick={handleOffsetResetClick}>
          Reset Offset
        </button>
      </fieldset>
    </>
  );
};
