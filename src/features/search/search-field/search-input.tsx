import * as React from 'react';
import { Input, InputProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';

const StyledInput = memoWithAs<InputProps & { hasError?: boolean }, 'input'>(
  forwardRefWithAs<InputProps & { hasError?: boolean }, 'input'>(
    ({ as = 'input', hasError, ...rest }, ref) => {
      return (
        <Input
          display="block"
          borderRadius="12px"
          bg="rgba(255,255,255,0.15)"
          p={0}
          top={0}
          left={0}
          pr="60px"
          right={0}
          bottom={0}
          type="text"
          name="search-bar"
          lineHeight="20px"
          fontSize="inherit"
          position="absolute"
          color="white"
          borderColor="rgba(255,255,255,0.25)"
          transitionProperty="border,box-shadow"
          backdropFilter="blur(10px)"
          _placeholder={{ color: 'white', opacity: 1 }}
          _hover={{
            borderColor: 'rgba(255,255,255,0.35)',
          }}
          _focus={{
            borderColor: 'rgba(255,255,255,0.5)',
            boxShadow: hasError
              ? `0 0 0 3px rgba(212, 0, 26, 0.5)`
              : `0 0 0 3px rgba(170, 179, 255, 0.5)`,
          }}
          boxShadow={
            hasError ? `0 0 0 3px rgba(212, 0, 26, 0.5)` : `0 0 0 3px rgba(170, 179, 255, 0)`
          }
          ref={ref}
          autoComplete="off"
          id="search-bar"
          {...rest}
        />
      );
    }
  )
);

export const SearchInput: ForwardRefExoticComponentWithAs<InputProps, 'input'> = memoWithAs(
  forwardRefWithAs<InputProps, 'input'>(({ ...rest }, ref) => (
    <StyledInput placeholder="Search the Stacks blockchain" ref={ref} {...rest} />
  ))
);
