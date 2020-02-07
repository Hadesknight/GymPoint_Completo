import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: space-between;

    h1 {
        font-size: 24px;
        color: #444;
    }

    div {
        display: flex;

        aside {
            display: flex;
            align-items: center;
            border: 1px solid #eee;
            background: #fff;
            border-radius: 4px;
            margin-left: 16px;
            padding: 0 10px;

            input {
                border: none;
                height: 36px;

                &::placeholder {
                    color: #999;
                }
            }
        }
    }
`;
