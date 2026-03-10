// import styled from 'styled-components';

// export const Container = styled.div`
//   max-width: 800px;
//   margin: 40px auto;
//   padding: 24px;
//   background-color: #ffffff;
//   border-radius: 16px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// `;

// export const ProfileWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
// `;

// export const InfoRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 12px 0;
//   border-bottom: 1px solid #f0f0f0;
// `;

// export const FieldLabel = styled.span`
//   font-weight: 600;
//   color: #555;
//   width: 30%;
// `;

// export const FieldValue = styled.span`
//   color: #333;
//   width: 65%;
//   text-align: right;
//   word-break: break-word;
// `;


import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    max-width: 100%;
    margin: 16px 4px;
    padding: 12px 4px;
    border-radius: 8px;
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0;
    gap: 4px;
  }
`;

export const FieldLabel = styled.span`
  font-weight: 600;
  color: #555;
  width: 30%;

  @media (max-width: 600px) {
    width: 100%;
    font-size: 15px;
    margin-bottom: 2px;
  }
`;

export const FieldValue = styled.span`
  color: #333;
  width: 65%;
  text-align: right;
  word-break: break-word;

  @media (max-width: 600px) {
    width: 100%;
    text-align: left;
    font-size: 15px;
  }
`;

