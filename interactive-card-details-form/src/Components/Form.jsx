import tw from 'twin.macro'
import {
    Input,
    InputWrapper,
    FormWrapper,
    Label,
    Button,
    Error,
} from '../styles/'
import iconComplete from '../assets/icon-complete.svg'

export default function Form({
    inputFields,
    setInputFields,
    isFormSubmitted,
    setIsFormSubmitted,
    setDefaultData,
}) {
    const getInputField = (id) => inputFields.find((obj) => obj.id === id)
    const getFocus = (id) => inputFields.find((obj) => obj.id === id).focus
    const getValue = (id) => inputFields.find((obj) => obj.id === id).value
    const getError = (id) => inputFields.find((obj) => obj.id === id).error

    const handleFocus = (e) =>
        setInputFields((prev) => [
            ...prev.filter((obj) => obj.id !== e.target.id),
            {
                ...prev.find((obj) => obj.id === e.target.id),
                focus: true,
                error: '',
            },
        ])

    const handleBlur = (e) =>
        setInputFields((prev) => [
            ...prev.filter((obj) => obj.id !== e.target.id),
            { ...prev.find((obj) => obj.id === e.target.id), focus: false },
        ])

    const isInputLimitExceed = (id, value) =>
        value.length > getInputField(id).limit ? true : false

    const getFormattedValue = (id, value) =>
        id === 'card-number'
            ? value
                  .replace(/[^\dA-Z]/g, '')
                  .replace(/[^\da-z]/g, '')
                  .replace(/(.{4})/g, '$1 ')
                  .trim()
            : id === 'card-exp-mm' || id === 'card-exp-yy' || id === 'card-cvv'
            ? value
                  .replace(/[^\dA-Z]/g, '')
                  .replace(/[^\da-z]/g, '')
                  .trim()
            : value

    const handleChange = (e) => {
        const { id, value } = e.target

        if (!isInputLimitExceed(id, value)) {
            setInputFields((prev) => [
                ...prev.filter((obj) => obj.id !== id),
                {
                    ...prev.find((obj) => obj.id === id),
                    value: getFormattedValue(id, value),
                },
            ])
        }
        setInputFields((prev) => prev)
    }

    const setError = (id, error) => {
        error = id === 'card-number' ? 'Must be 16 character' : error
        setInputFields((prev) => [
            ...prev.filter((obj) => obj.id !== id),
            {
                ...prev.find((obj) => obj.id === id),
                error,
            },
        ])
    }

    const isFormHasError = () =>
        (inputFields.filter((inputFields) => inputFields.value.length === 0)
            .length === 0
            ? false
            : true) ||
        (inputFields.filter((inputField) => inputField.error.length !== 0)
            .length === 0
            ? false
            : true)

    const handleSubmit = () => {
        inputFields.forEach((inputField) => {
            inputField.value.length === 0
                ? setError(inputField.id, "Can't be blank")
                : inputField.value.length < inputField.limit &&
                  inputField.id !== 'card-holder-name'
                ? setError(
                      inputField.id,
                      `Must be ${inputField.limit} character`
                  )
                : null
        })
        if (!isFormHasError()) {
            setIsFormSubmitted(true)
        }
    }

    const handleContinue = () => {
        setIsFormSubmitted(false)
        setDefaultData()
    }
    return (
        <>
            <FormWrapper>
                {isFormSubmitted ? (
                    <>
                        <div className="w-[90%]">
                            <img
                                src={iconComplete}
                                className="mx-auto  w-[25%]"
                            />
                            <div className="my-[5%] mx-auto w-fit text-4xl">
                                Thank You!
                            </div>
                            <div className="my-[5%] mx-auto mb-[5%] w-fit text-lg text-dark-grayish-violet md:text-xl">
                                We've added your card details
                            </div>
                        </div>
                        <Button onClick={handleContinue}>Continue</Button>
                    </>
                ) : (
                    <>
                        <Label htmlFor="card-holder-name">
                            CARDHOLDER NAME
                        </Label>
                        <InputWrapper
                            focus={getFocus('card-holder-name')}
                            error={getError('card-holder-name')}
                        >
                            <Input
                                id="card-holder-name"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="e.g. Jane Appleseed"
                                value={getValue('card-holder-name')}
                                onChange={handleChange}
                            />
                            <Error>{getError('card-holder-name')}</Error>
                        </InputWrapper>

                        <Label htmlFor="card-number">CARD NUMBER</Label>
                        <InputWrapper
                            focus={getFocus('card-number')}
                            error={getError('card-number')}
                        >
                            <Input
                                id="card-number"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                size="12"
                                placeholder="e.g. 1234 5678 9123 000"
                                value={getValue('card-number')}
                                onChange={handleChange}
                            />
                            <Error>{getError('card-number')}</Error>
                        </InputWrapper>

                        <div className="mb-2 flex w-[90%]  flex-row justify-between">
                            <div className="w-[55%] md:w-[45%]">
                                <Label htmlFor="card-exp-date">
                                    EXP. DATE (MM/YY)
                                </Label>
                                <div
                                    className="flex flex-row"
                                    id="card-exp-date"
                                >
                                    <InputWrapper
                                        focus={getFocus('card-exp-mm')}
                                        error={getError('card-exp-mm')}
                                    >
                                        <Input
                                            id="card-exp-mm"
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            size="3"
                                            placeholder="MM"
                                            value={getValue('card-exp-mm')}
                                            onChange={handleChange}
                                        />
                                        <Error>{getError('card-exp-mm')}</Error>
                                    </InputWrapper>

                                    <InputWrapper
                                        focus={getFocus('card-exp-yy')}
                                        error={getError('card-exp-yy')}
                                        css={tw`ml-2`}
                                    >
                                        <Input
                                            id="card-exp-yy"
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            size="3"
                                            placeholder="YY"
                                            value={getValue('card-exp-yy')}
                                            onChange={handleChange}
                                        />
                                        <Error>{getError('card-exp-yy')}</Error>
                                    </InputWrapper>
                                </div>
                            </div>
                            <div className="w-[45%] md:w-[60%]">
                                <Label
                                    htmlFor="card-cvv"
                                    css={tw`ml-2 md:ml-4`}
                                >
                                    CVV
                                </Label>
                                <InputWrapper
                                    focus={getFocus('card-cvv')}
                                    error={getError('card-cvv')}
                                    css={tw`ml-2 md:ml-4`}
                                >
                                    <Input
                                        id="card-cvv"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        placeholder="e.g. 123"
                                        value={getValue('card-cvv')}
                                        onChange={handleChange}
                                    />
                                    <Error>{getError('card-cvv')}</Error>
                                </InputWrapper>
                            </div>
                        </div>
                        <Button onClick={handleSubmit}>Confirm</Button>
                    </>
                )}
            </FormWrapper>
        </>
    )
}
