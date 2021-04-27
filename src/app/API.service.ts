/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type CreateAUDGENUSUARIOSInput = {
  ID: string;
};

export type AUDGENUSUARIOS = {
  __typename: "AUDGENUSUARIOS";
  ID?: string;
};

export type UpdateAUDGENUSUARIOSInput = {
  ID: string;
};

export type DeleteAUDGENUSUARIOSInput = {
  ID: string;
};

export type CreateAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type AUDGENPROCESOS = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO?: string;
};

export type UpdateAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type DeleteAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type TableAUDGENUSUARIOSFilterInput = {
  ID?: TableStringFilterInput | null;
};

export type TableStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type AUDGENUSUARIOSConnection = {
  __typename: "AUDGENUSUARIOSConnection";
  items?: Array<AUDGENUSUARIOS | null> | null;
  nextToken?: string | null;
};

export type TableAUDGENPROCESOSFilterInput = {
  ID_REGISTRO?: TableStringFilterInput | null;
};

export type AUDGENPROCESOSConnection = {
  __typename: "AUDGENPROCESOSConnection";
  items?: Array<AUDGENPROCESOS | null> | null;
  nextToken?: string | null;
};

export type CreateAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type UpdateAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type DeleteAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type CreateAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type UpdateAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type DeleteAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type GetAUDGENUSUARIOSQuery = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type ListAUDGENUSUARIOSQuery = {
  __typename: "AUDGENUSUARIOSConnection";
  items?: Array<{
    __typename: "AUDGENUSUARIOS";
    ID: string;
  } | null> | null;
  nextToken?: string | null;
};

export type GetAUDGENPROCESOSQuery = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type ListAUDGENPROCESOSQuery = {
  __typename: "AUDGENPROCESOSConnection";
  items?: Array<{
    __typename: "AUDGENPROCESOS";
    ID_REGISTRO: string;
  } | null> | null;
  nextToken?: string | null;
};

export type OnCreateAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnUpdateAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnDeleteAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnCreateAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type OnUpdateAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

export type OnDeleteAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  ID_REGISTRO: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateAUDGENUSUARIOS(
    input: CreateAUDGENUSUARIOSInput
  ): Promise<CreateAUDGENUSUARIOSMutation> {
    const statement = `mutation CreateAUDGENUSUARIOS($input: CreateAUDGENUSUARIOSInput!) {
        createAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateAUDGENUSUARIOSMutation>response.data.createAUDGENUSUARIOS;
  }
  async UpdateAUDGENUSUARIOS(
    input: UpdateAUDGENUSUARIOSInput
  ): Promise<UpdateAUDGENUSUARIOSMutation> {
    const statement = `mutation UpdateAUDGENUSUARIOS($input: UpdateAUDGENUSUARIOSInput!) {
        updateAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateAUDGENUSUARIOSMutation>response.data.updateAUDGENUSUARIOS;
  }
  async DeleteAUDGENUSUARIOS(
    input: DeleteAUDGENUSUARIOSInput
  ): Promise<DeleteAUDGENUSUARIOSMutation> {
    const statement = `mutation DeleteAUDGENUSUARIOS($input: DeleteAUDGENUSUARIOSInput!) {
        deleteAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteAUDGENUSUARIOSMutation>response.data.deleteAUDGENUSUARIOS;
  }
  async CreateAUDGENPROCESOS(
    input: CreateAUDGENPROCESOSInput
  ): Promise<CreateAUDGENPROCESOSMutation> {
    const statement = `mutation CreateAUDGENPROCESOS($input: CreateAUDGENPROCESOSInput!) {
        createAUDGENPROCESOS(input: $input) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateAUDGENPROCESOSMutation>response.data.createAUDGENPROCESOS;
  }
  async UpdateAUDGENPROCESOS(
    input: UpdateAUDGENPROCESOSInput
  ): Promise<UpdateAUDGENPROCESOSMutation> {
    const statement = `mutation UpdateAUDGENPROCESOS($input: UpdateAUDGENPROCESOSInput!) {
        updateAUDGENPROCESOS(input: $input) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateAUDGENPROCESOSMutation>response.data.updateAUDGENPROCESOS;
  }
  async DeleteAUDGENPROCESOS(
    input: DeleteAUDGENPROCESOSInput
  ): Promise<DeleteAUDGENPROCESOSMutation> {
    const statement = `mutation DeleteAUDGENPROCESOS($input: DeleteAUDGENPROCESOSInput!) {
        deleteAUDGENPROCESOS(input: $input) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteAUDGENPROCESOSMutation>response.data.deleteAUDGENPROCESOS;
  }
  async GetAUDGENUSUARIOS(ID: string): Promise<GetAUDGENUSUARIOSQuery> {
    const statement = `query GetAUDGENUSUARIOS($ID: String!) {
        getAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetAUDGENUSUARIOSQuery>response.data.getAUDGENUSUARIOS;
  }
  async ListAUDGENUSUARIOS(
    filter?: TableAUDGENUSUARIOSFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListAUDGENUSUARIOSQuery> {
    const statement = `query ListAUDGENUSUARIOS($filter: TableAUDGENUSUARIOSFilterInput, $limit: Int, $nextToken: String) {
        listAUDGENUSUARIOS(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            ID
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListAUDGENUSUARIOSQuery>response.data.listAUDGENUSUARIOS;
  }
  async GetAUDGENPROCESOS(
    ID_REGISTRO: string
  ): Promise<GetAUDGENPROCESOSQuery> {
    const statement = `query GetAUDGENPROCESOS($ID_REGISTRO: String!) {
        getAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID_REGISTRO
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetAUDGENPROCESOSQuery>response.data.getAUDGENPROCESOS;
  }
  async ListAUDGENPROCESOS(
    filter?: TableAUDGENPROCESOSFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListAUDGENPROCESOSQuery> {
    const statement = `query ListAUDGENPROCESOS($filter: TableAUDGENPROCESOSFilterInput, $limit: Int, $nextToken: String) {
        listAUDGENPROCESOS(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            ID_REGISTRO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListAUDGENPROCESOSQuery>response.data.listAUDGENPROCESOS;
  }
  OnCreateAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnCreateAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnCreateAUDGENUSUARIOS($ID: String) {
        onCreateAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateAUDGENUSUARIOSSubscription>>;
  }

  OnUpdateAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnUpdateAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnUpdateAUDGENUSUARIOS($ID: String) {
        onUpdateAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateAUDGENUSUARIOSSubscription>>;
  }

  OnDeleteAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnDeleteAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnDeleteAUDGENUSUARIOS($ID: String) {
        onDeleteAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteAUDGENUSUARIOSSubscription>>;
  }

  OnCreateAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnCreateAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnCreateAUDGENPROCESOS($ID_REGISTRO: String) {
        onCreateAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateAUDGENPROCESOSSubscription>>;
  }

  OnUpdateAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnUpdateAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnUpdateAUDGENPROCESOS($ID_REGISTRO: String) {
        onUpdateAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateAUDGENPROCESOSSubscription>>;
  }

  OnDeleteAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnDeleteAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnDeleteAUDGENPROCESOS($ID_REGISTRO: String) {
        onDeleteAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          ID_REGISTRO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteAUDGENPROCESOSSubscription>>;
  }
}
